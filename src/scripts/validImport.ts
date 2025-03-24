import fs from 'fs';
import sequelize from '../config/db';
import Epi from '../models/epi.model';
import { Op } from 'sequelize';

async function validateCaNumbers() {
  // Ensure database connection
  await sequelize.sync();

  const filePath = 'tgg_export_caepi.txt'; // Assumindo que este é o arquivo principal

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error('❌ Arquivo txt não encontrado.');
    return;
  }

  // Read file contents
  const lines = fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .filter(line => line.trim() !== '');

  // Extract CA numbers from the file
  const caNumbersFromFile = lines
    .map(line => {
      const fields = line.split('|');
      return parseInt(fields[0].trim());
    })
    .filter(ca => !isNaN(ca)); // Remove invalid CA numbers

  console.log(`📊 Total de CA numbers no arquivo: ${caNumbersFromFile.length}`);

  // Find which CA numbers are missing from the database
  const existingCaNumbers = await Epi.findAll({
    attributes: ['ca_number'],
    where: {
      ca_number: {
        [Op.in]: caNumbersFromFile
      }
    }
  });

  const existingCaSet = new Set(existingCaNumbers.map(epi => epi.ca_number));
  
  // Identify missing CA numbers
  const missingCaNumbers = caNumbersFromFile.filter(ca => !existingCaSet.has(ca));

  // Generate log of missing CA numbers
  if (missingCaNumbers.length > 0) {
    const logContent = missingCaNumbers.join('\n');
    fs.writeFileSync('ca_numbers_faltantes.log', logContent);

    console.log(`❌ Encontrados ${missingCaNumbers.length} CA numbers faltando no banco de dados.`);
    console.log('📄 Log de CA numbers faltantes gerado em ca_numbers_faltantes.log');
    
    // Optional: Print first few missing CA numbers
    console.log('Primeiros CA numbers faltantes:');
    missingCaNumbers.slice(0, 10).forEach(ca => console.log(`- ${ca}`));
    if (missingCaNumbers.length > 10) {
      console.log(`... e mais ${missingCaNumbers.length - 10} CA numbers`);
    }
  } else {
    console.log('✅ Todos os CA numbers do arquivo estão presentes no banco de dados.');
  }

  // Close database connection
  await sequelize.close();
}

validateCaNumbers();