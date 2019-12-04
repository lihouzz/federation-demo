const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const gateway = new ApolloGateway({
  serviceList: [
    { name: "accounts", url: "http://localhost:4101/graphql" },
    { name: "reviews", url: "http://localhost:4102/graphql" },
    { name: "products", url: "http://localhost:4103/graphql" },
    { name: "inventory", url: "http://localhost:4104/graphql" }
  ]
});

(async () => {
  const { schema, executor } = await gateway.load();

  const server = new ApolloServer({ schema, executor });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();
