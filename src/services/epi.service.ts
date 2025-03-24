import Epi from '../models/epi.model';

class EpiService {
    async getEpiByCA(ca_number: number) {
        return await Epi.findByPk(ca_number);
    }

    async importEpiData(data: any) {
        await Epi.upsert(data);
    }
}

export default new EpiService();
