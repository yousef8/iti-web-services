const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Post = require("../models/Post"); // Import Post model
const { GraphQLError } = require("graphql");

const loginResolver = async (parent, args) => {
  const { email, password } = args;
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid Credentials");

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) throw new Error("Invalid Credentials");

  const userToken = jwt.sign(
    { email: user.email, id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    isSuccess: true,
    message: "login succeeded",
    token: userToken,
  };
};

const registerUserResolver = async (parent, user) => {
  const existingUser = await User.findOne({ email: user.email });
  if (existingUser) {
    throw new GraphQLError("The email you entered is duplicate", {
      extensions: { code: "DUPLICATE_EMAIL" },
    });
  }

  const hashedPassword = await bcrypt.hash(user.password, 12);
  const newUser = new User({
    ...user,
    password: hashedPassword,
  });

  await newUser.save();
  return { isSuccess: true, message: "User registered successfully" };
};

const resolvers = {
  User: {
    posts: async (parent, args) => {
      return await Post.find({ userId: parent.id }).limit(args.last);
    },
  },
  Mutation: {
    register: registerUserResolver,
    login: loginResolver,
  },
  Query: {
    profile: async (parent, args, context) => {
      const user = await User.findById(context.loggedUser.id);
      return user;
    },
    getUsers: async (parent, args, context) => {
      const {
        pagination: { page, count },
      } = args;

      if (!context.loggedUser?.email) {
        throw new Error("UNAUTHORIZED");
      }

      const users = await User.find()
        .skip((page - 1) * count)
        .limit(count);

      return users;
    },
    getUserByID: async (parent, args) => {
      const { userId } = args;
      const user = await User.findById(userId);
      return user;
    },
    getPosts: async (parent, args, context) => {
      if (!context.loggedUser?.id) {
        throw new Error("UNAUTHORIZED");
      }

      const {
        pagination: { page, count },
      } = args;
      return await Post.find({ userId: context.loggedUser.id })
        .skip((page - 1) * count)
        .limit(count);
    },
  },
};

module.exports = { resolvers };
