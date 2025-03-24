import fs from 'fs';
import sequelize from '../config/db';
import Epi from '../models/epi.model';

async function retryInvalidImports() {
  await sequelize.sync();

  const filePath = 'linhas_invalidas.log';

  if (!fs.existsSync(filePath)) {
    console.error('❌ Arquivo linhas_invalidas.log não encontrado.');
    return;
  }

  const lines = fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .filter(line => line.trim() !== '');

  let successCount = 0;
  let stillInvalidCount = 0;
  const remainingInvalids: string[] = [];

  console.log(`\n🔁 Tentando reimportar ${lines.length} linhas inválidas...\n`);

  for (const line of lines) {
    const fields = line.split('|');

    if (fields.length >= 6) {
      const ca_number = parseInt(fields[0].trim());

      if (isNaN(ca_number)) {
        console.warn(`❌ CA inválido → "${fields[0]}"`);
        remainingInvalids.push(line);
        stillInvalidCount++;
        continue;
      }

      const validadeStr = fields[1].trim();
      let validade: Date | null = null;

      // Multiple date parsing strategies
      const dateParsers = [
        () => new Date(validadeStr), // Default parsing
        () => {
          // Brazilian date format (DD/MM/YYYY)
          const [day, month, year] = validadeStr.split('/').map(Number);
          return new Date(year, month - 1, day);
        },
        () => {
          // YYYY-MM-DD format
          return new Date(validadeStr.replace(/\./g, '-'));
        }
      ];

      for (const parseDate of dateParsers) {
        try {
          const parsedDate = parseDate();
          if (!isNaN(parsedDate.getTime())) {
            validade = parsedDate;
            break;
          }
        } catch (error) {
          continue;
        }
      }

      try {
        const existingRecord = await Epi.findOne({ where: { ca_number } });

        const dataToSave: any = {
          ca_number,
          status: fields[2],
          codigo: fields[3],
          cnpj: fields[4],
          empresa: fields[5],
        };

        // Only add validade if a valid date was parsed
        if (validade) {
          dataToSave.validade = validade;
        } else {
          console.warn(`⚠️ Data inválida para CA ${ca_number} → "${validadeStr}". Importando sem data.`);
        }

        if (existingRecord) {
          await existingRecord.update(dataToSave);
          console.log(`🔄 Atualizado CA: ${ca_number}`);
        } else {
          await Epi.create(dataToSave);
          console.log(`✅ Inserido CA: ${ca_number}`);
        }

        successCount++;
      } catch (error) {
        console.error(`❌ Erro ao importar CA ${ca_number}:`, error);
        remainingInvalids.push(line);
        stillInvalidCount++;
      }
    } else {
      console.warn(`❌ Linha com campos insuficientes ignorada.`);
      remainingInvalids.push(line);
      stillInvalidCount++;
    }
  }

  fs.writeFileSync('linhas_invalidas.log', remainingInvalids.join('\n'));

  console.log(`\n🎯 Reimportação concluída.`);
  console.log(`✅ Sucesso: ${successCount}`);
  console.log(`❌ Ainda inválidas: ${stillInvalidCount}`);
  console.log(`📄 Arquivo linhas_invalidas.log atualizado.`);

  await sequelize.close();
}

retryInvalidImports();