import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../config/postgres'

export class AccountDTO {
    id: number;
    login: string;
    password?: string | undefined;
    name: string;
    mail: string;

    constructor(entity: AccountDTO) {
        this.id = entity.id
        this.login = entity.login
        this.password = entity?.password
        this.name = entity.name
        this.mail = entity.mail
    }

    redisJSON() {
        return JSON.stringify({id: this.id, name: this.name})
    }
}

class AccountModel extends Model {  }

AccountModel.init({
    login: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mail: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'account'
});

export default AccountModel;