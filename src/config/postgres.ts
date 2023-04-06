import { Sequelize } from 'sequelize';

// Option 1: Passing a connection URI
const sequelize = new Sequelize('postgresql://localhost:5432/postgres') // Example for postgres

export default sequelize;