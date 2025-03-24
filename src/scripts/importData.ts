import fs from 'fs';
import sequelize from '../config/db';
import Epi from '../models/epi.model';

async function importData() {
  await sequelize.sync();

  const filePath = 'tgg_export_caepi.txt'; 
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n').filter(line => line.trim() !== '');

  const caNumbersFromFile: number[] = [];
  let importedCount = 0;
  let invalidCount = 0;

  console.log(`📥 Iniciando importação de ${lines.length} registros...`);

  for (const line of lines) {
    const fields = line.split('|');
    if (fields.length >= 6) {
      const ca_number = parseInt(fields[0].trim());

      if (isNaN(ca_number)) {
        console.warn(`⚠️ Linha ignorada: CA inválido → "${fields[0]}"`);
        fs.appendFileSync('linhas_invalidas.log', line + '\n');
        invalidCount++;
        continue;
      }

      const validadeStr = fields[1].trim();
      const validade = new Date(validadeStr);

      if (isNaN(validade.getTime())) {
        console.warn(`⚠️ Linha ignorada: data inválida para CA ${ca_number} → "${validadeStr}"`);
        fs.appendFileSync('linhas_invalidas.log', line + '\n');
        invalidCount++;
        continue;
      }

      caNumbersFromFile.push(ca_number);

      try {
        const existingRecord = await Epi.findOne({ where: { ca_number } });

        if (existingRecord) {
          console.log(`🔄 Atualizando CA: ${ca_number}`);
          await existingRecord.update({
            validade,
            status: fields[2],
            codigo: fields[3],
            cnpj: fields[4],
            empresa: fields[5],
          });
        } else {
          console.log(`✅ Inserindo novo CA: ${ca_number}`);
          await Epi.create({
            ca_number,
            validade,
            status: fields[2],
            codigo: fields[3],
            cnpj: fields[4],
            empresa: fields[5],
          });
        }

        importedCount++;
      } catch (error) {
        console.error(`❌ Erro ao processar CA ${ca_number}:`, error);
        fs.appendFileSync('linhas_invalidas.log', line + '\n');
        invalidCount++;
      }
    }
  }

  console.log(`✅ Importação concluída: ${importedCount}/${lines.length} registros processados.`);
  console.log(`⚠️ Total de linhas inválidas: ${invalidCount}. Verifique o arquivo 'linhas_invalidas.log'.`);

  // Verificação de integridade
  const caNumbersFromDB = (await Epi.findAll({ attributes: ['ca_number'] })).map(epi => epi.ca_number);
  const missingCAs = caNumbersFromFile.filter(ca => !caNumbersFromDB.includes(ca));

  if (missingCAs.length > 0) {
    console.warn(`⚠️ Atenção: ${missingCAs.length} registros não foram encontrados após a importação.`);
    fs.writeFileSync('missing_cas.log', missingCAs.join('\n'));
    console.log(`📝 Lista de CAs ausentes salva em missing_cas.log.`);
  } else {
    console.log(`🎉 Todos os registros foram importados com sucesso!`);
  }

  await sequelize.close();
}

importData();
