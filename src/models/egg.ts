import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/postgres'

class EggModel extends Model {  }

EggModel.init({
    countDown: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'count_down'
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    account: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    hatched: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    sequelize,
    modelName: 'egg'
});

export default EggModel;