import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class DriftPoint extends Model {
  public id!: string;
  public prompt!: string;
  public response!: string;
  public category!: string;
  public embedding!: number[];
  public timestamp!: Date;
  public isBaseline!: boolean;
}

DriftPoint.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  prompt: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  embedding: {
    type: DataTypes.ARRAY(DataTypes.FLOAT),
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  isBaseline: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  sequelize,
  modelName: 'DriftPoint',
  tableName: 'drift_points',
});
