import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/postgres'
import AccountModel from './account';

class EggModel extends Model {  }

EggModel.init({
    countDown: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    hatched: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'egg'
});

// EggModel.belongsToMany(AccountModel, 
    // {through: 'Account', sourceKey: 'account', targetKey: 'id'})
// {as: 'Account', foreignKey: 'eggs_account_fk'});
// AccountModel.hasMany(EggModel, {foreignKey: 'eggs_account_fk'});

export default EggModel;