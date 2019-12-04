const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Query {
    topNotes(first: Int = 5): [Note]
  }

  type Note @key(fields: "id") {
    id: Int!
    name: String
    price: Int
    weight: Int
  }
`;

const resolvers = {
  Note: {
    __resolveReference(object) {
      return products.find(product => product.id === object.id);
    }
  },
  Query: {
    topNotes(_, args) {
      return products.slice(0, args.first);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4103 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const products = [
  {
    id: 111,
    name: "Table",
    price: 899,
    weight: 100
  },
  {
    id: 222,
    name: "Couch",
    price: 1299,
    weight: 1000
  },
  {
    id: 333,
    name: "Chair",
    price: 54,
    weight: 50
  }
];
