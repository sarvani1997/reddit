const { prettify } = require("sql-log-prettifier");
const faker = require("faker");
const postgres = require("./postgres");

async function seed() {
  await postgres.authenticate();
  await postgres.sync({
    force: true,
    logging: (s) => {
      const string = prettify(s);
      console.log(string);
    },
  });

  const {
    user: User,
    subreddit: SubReddit,
    post: Post,
    comment: Comment,
  } = postgres.models;

  // => users table
  //  => subreddits
  //  => posts
  //  => comments

  // users

  const users = [...Array(50).keys()].map(() => ({
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    avatar: faker.internet.avatar(),
  }));
  await User.bulkCreate(users);

  // Subreddit : name, nick, userId

  const subreddits = [...Array(100).keys()].map(() => ({
    name: faker.lorem.words(),
    nick: faker.internet.userName(),
    userId: faker.datatype.number({
      min: 1,
      max: 10,
    }),
  }));
  await SubReddit.bulkCreate(subreddits);

  // Post: title, text, userId, subredditId

  const posts = [...Array(1000).keys()].map(() => ({
    title: faker.lorem.sentence(),
    text: faker.lorem.paragraph(),
    userId: faker.datatype.number({
      min: 1,
      max: 10,
    }),
    subredditId: faker.datatype.number({
      min: 1,
      max: 10,
    }),
    upvotes: 0,
  }));

  await Post.bulkCreate(posts);

  // Comment: text, userId, subredditId, postId

  const comments = [...Array(10000).keys()].map(() => ({
    text: faker.lorem.lines(),
    userId: faker.datatype.number({
      min: 1,
      max: 10,
    }),
    postId: faker.datatype.number({
      min: 1,
      max: 100,
    }),
  }));

  for (const comment of comments) {
    comment.subredditId = posts[comment.postId - 1].subredditId;
  }

  await Comment.bulkCreate(comments);
}

seed();
