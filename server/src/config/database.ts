import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL || 'postgresql://admin:password@localhost:5432/edm_db';

export const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false, // Set to true to see SQL logs
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Connection has been established successfully.');
    
    // Sync models
    await sequelize.sync({ alter: true });
    console.log('📦 Database models synchronized.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};
