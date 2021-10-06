const { Sequelize, DataTypes } = require("sequelize");
const { prettify } = require("sql-log-prettifier");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: function (s) {
      let string = prettify(s);
      console.log(string);
    },
  }
);

const User = sequelize.define(
  "User",
  {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: DataTypes.STRING,
  },
  {
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
  }
);

const Login = sequelize.define("Login", {
  token: DataTypes.STRING,
});

Login.belongsTo(User, {
  onDelete: "CASCADE",
  foreignKey: "userId",
});

User.hasMany(Login, {
  foreignKey: "userId",
});

module.exports = sequelize;
