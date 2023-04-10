import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/postgres'
import AccountModel from './account';

class MonsterModel extends Model {  }

MonsterModel.init({
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    life: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 20,
    },
    food: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 60,
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.4,
    },
    happiness: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    health: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    alive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    eggId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },    
    accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'monster'
});

export default MonsterModel;