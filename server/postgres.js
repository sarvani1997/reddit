const { Sequelize, DataTypes } = require('sequelize');
const { prettify } = require('sql-log-prettifier');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: (s) => {
      const string = prettify(s);
      console.log(string);
    },
  }
);

// User

const User = sequelize.define(
  'user',
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
    avatar: DataTypes.STRING,
  },
  {
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
  }
);

// Login

const Login = sequelize.define('login', {
  token: DataTypes.STRING,
});

Login.belongsTo(User, {
  onDelete: 'CASCADE',
});

// Subreddit : name, nick, userId

const SubReddit = sequelize.define('subreddit', {
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
  onDelete: 'CASCADE',
});

// Post: title, text, userId, subredditId

const Post = sequelize.define('post', {
  title: DataTypes.STRING,
  text: DataTypes.TEXT,
  upvotes: DataTypes.INTEGER,
});

Post.belongsTo(User, {
  onDelete: 'CASCADE',
});

Post.belongsTo(SubReddit, {
  onDelete: 'CASCADE',
});

// Comment: text, userId, subredditId, postId

const Comment = sequelize.define('comment', {
  text: DataTypes.TEXT,
  upvotes: DataTypes.INTEGER,
});

Comment.belongsTo(User, {
  onDelete: 'CASCADE',
});

Comment.belongsTo(SubReddit, {
  onDelete: 'CASCADE',
});

Comment.belongsTo(Post, {
  onDelete: 'CASCADE',
});

// Upvote: postId, userId, count

const Upvote = sequelize.define('upvote', {
  vote: DataTypes.BOOLEAN,
});

Post.belongsToMany(User, {
  through: Upvote,
});

// Comment.belongsToMany(User, {
//   through: Upvote,
// });

module.exports = sequelize;
