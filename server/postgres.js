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

// User

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

// Login

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

// Subreddit : name, nick, userId

const SubReddit = sequelize.define("SubReddit", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nick: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

SubReddit.belongsTo(User, {
  onDelete: "CASCADE",
  foreignKey: "userId",
});

User.hasMany(SubReddit, {
  foreignKey: "userId",
});

// Post: title, text, userId, subredditId

const Post = sequelize.define("Post", {
  title: DataTypes.STRING,
  text: DataTypes.TEXT,
});

Post.belongsTo(User, {
  onDelete: "CASCADE",
  foreignKey: "userId",
});

User.hasMany(Post, {
  foreignKey: "userId",
});

Post.belongsTo(SubReddit, {
  onDelete: "CASCADE",
  foreignKey: "subredditId",
});

SubReddit.hasMany(Post, {
  foreignKey: "subredditId",
});

// Comment: text, userId, subredditId, postId

const Comment = sequelize.define("Comment", {
  text: DataTypes.TEXT,
});

Comment.belongsTo(User, {
  onDelete: "CASCADE",
  foreignKey: "userId",
});

User.hasMany(Comment, {
  foreignKey: "userId",
});

Comment.belongsTo(SubReddit, {
  onDelete: "CASCADE",
  foreignKey: "subredditId",
});

SubReddit.hasMany(Comment, {
  foreignKey: "subredditId",
});

Comment.belongsTo(Post, {
  onDelete: "CASCADE",
  foreignKey: "postId",
});

Post.hasMany(Comment, {
  foreignKey: "postId",
});

module.exports = sequelize;
