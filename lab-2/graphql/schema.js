const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    isActive: Boolean!
    age: Int!
    name: String!
    email: String
    role: Role!
    posts(last: Int): [Post]
  }

  type Post {
    id: ID!
    title: String!
    body: String!
  }

  type Comment {
    name: String
  }

  union SearchResult = User | Post | Comment

  enum Role {
    ADMIN
    USER
    GUEST
  }

  input PaginationInput {
    page: Int!
    count: Int!
  }

  type Query {
    helloworld: String
    profile: User
    getPosts(pagination: PaginationInput!): [Post]
    getUsers(pagination: PaginationInput!): [User!]!
    getUserByID(userId: ID!): User!
  }

  type RegisterationResponse {
    isSuccess: Boolean!
    message: String!
  }

  type LoginResult {
    isSuccess: Boolean!
    message: String!
    token: String!
  }

  type Mutation {
    register(
      email: String!
      name: String!
      password: String!
    ): RegisterationResponse

    login(email: String!, password: String!): LoginResult
  }
`;

module.exports = { typeDefs };
