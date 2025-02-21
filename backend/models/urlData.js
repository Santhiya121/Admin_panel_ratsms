const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize; // Destructure sequelize from the exported object

const Link = sequelize.define(
  'Link',
  {
    targetURL: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    domainAuthority: {
      type: DataTypes.INTEGER,
    },
    pageAuthority: {
      type: DataTypes.INTEGER,
    },
    spamScore: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true, // Enable createdAt and updatedAt
  }
);

module.exports = {Link};
