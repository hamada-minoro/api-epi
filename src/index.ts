import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from './config/logger';
import routes from './routes/routes';
import sequelize from './config/db';
import { ENV } from './config/env';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(logger);
app.use('/api', routes); 

sequelize.sync().then(() => {
    console.log('Banco de dados sincronizado');
    app.listen(ENV.PORT, () => {
        console.log(`Servidor rodando em http://localhost:${ENV.PORT}`);
    });
});
