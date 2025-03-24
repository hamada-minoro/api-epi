import { Request, Response } from 'express';
import EpiService from '../services/epi.service';

class EpiController {
    async getEpi(req: Request, res: Response) {
        const { ca_number } = req.params;
        const epi = await EpiService.getEpiByCA(Number(ca_number));

        if (epi) {
            res.json(epi);
        } else {
            res.status(404).json({ message: 'EPI não encontrado' });
        }
    }
}

export default new EpiController();
