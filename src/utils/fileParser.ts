import fs from 'fs';

export function parseTxtFile(filePath: string) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');
    
    return lines.map(line => {
        const fields = line.split('|');
        if (fields.length < 6) return null;
        return {
            ca_number: parseInt(fields[0]),
            validade: fields[1],
            status: fields[2],
            codigo: fields[3],
            cnpj: fields[4],
            empresa: fields[5]
        };
    }).filter(item => item !== null);
}