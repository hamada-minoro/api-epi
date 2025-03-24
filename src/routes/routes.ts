import { Router } from 'express';
import EpiController from '../controllers/epi.controller';

const router = Router();

// Definição de rotas da API
router.get('/epi/:ca_number', EpiController.getEpi);

export default router;
