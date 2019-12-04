const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Note @key(fields: "id") {
    id: Int! @external
    weight: Int @external
    price: Int @external
    inStock: Boolean
    shippingEstimate: Int @requires(fields: "price weight")
  }
`;

const resolvers = {
  Note: {
    __resolveReference(object) {
      return {
        ...object,
        ...inventory.find(product => product.id === object.id)
      };
    },
    shippingEstimate(object) {
      // free for expensive items
      if (object.price > 1000) return 0;
      // estimate is based on weight
      return object.weight * 0.5;
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

server.listen({ port: 4104 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const inventory = [
  { id: 111, inStock: true },
  { id: 222, inStock: false },
  { id: 333, inStock: true }
];
