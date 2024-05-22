const { ApolloServer } = require("apollo-server");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { typeDefs } = require("./graphql/schema");
const { resolvers } = require("./graphql/resolvers");
const connectDB = require("./utils/db");

// Connect to MongoDB
connectDB();

const app = new ApolloServer({
  context: async (ctx) => {
    let loggedUser = null;
    const token = ctx.req.headers["authorization"];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      loggedUser = payload;
    } catch (error) {
      console.error(error);
    }

    return { loggedUser };
  },
  typeDefs,
  resolvers,
});

app.listen(3001).then(() => console.log("Server started on port 3001"));
