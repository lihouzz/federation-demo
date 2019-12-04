const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type ChatMessageObject {
    id: ID!
    body: String
    note: Note
  }

  extend type Note @key(fields: "id") {
    id: Int! @external
  }
  
  extend type Query {
    getChatMessageObjectById(id: Int): ChatMessageObject
  }
`;

const resolvers = {
  Query: {
      getChatMessageObjectById(_, args) {
          return reviews.find(review => review.id == args.id);
      },
  },
  ChatMessageObject: {
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4102 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const reviews = [
  {
    id: "1",
    authorID: "1",
    note: { id: 111 },
    body: "Love it!"
  },
  {
    id: "2",
    authorID: "1",
    note: { id: 222 },
    body: "Too expensive."
  },
  {
    id: "3",
    authorID: "2",
    note: { id: 333 },
    body: "Could be better."
  },
  {
    id: "4",
    authorID: "2",
    note: { id: 444 },
    body: "Prefer something else."
  }
];
