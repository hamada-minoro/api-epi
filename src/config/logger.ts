import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

const logDir = path.resolve(__dirname, '../../logs'); if (!fs.existsSync(logDir)) { fs.mkdirSync(logDir, { recursive: true }); }

const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });

const logStream = fs.createWriteStream(path.join(__dirname, '../../logs/access.log'), { flags: 'a' });

export const logger = morgan('combined', { stream: logStream });