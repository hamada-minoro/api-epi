import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Epi extends Model {
    public ca_number!: number;
    public validade!: Date;
    public status!: string;
    public codigo!: string;
    public cnpj!: string;
    public empresa!: string;
}

Epi.init(
    {
        ca_number: { type: DataTypes.INTEGER, primaryKey: true },
        validade: DataTypes.DATE,
        status: DataTypes.STRING,
        codigo: DataTypes.STRING,
        cnpj: DataTypes.STRING,
        empresa: DataTypes.STRING,
    },
    {
        sequelize,
        tableName: 'epis',
        timestamps: false,
    }
);

export default Epi;
