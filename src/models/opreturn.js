module.exports = (sequelize, DataTypes) => {
  const TestData = sequelize.define('testdata', {
    opreturn: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    txhash: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false
    },
    blockhash: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    blockheight: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE(3),
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE(3),
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
      field: 'updated_at'
    }
  },
  {
    indexes: [ {fields: ['opreturn']} ] //Add opreturn column as index to make searching faster
  }
  );
  return TestData;
};