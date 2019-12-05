const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const gateway = new ApolloGateway({
  serviceList: [
    { name: "accounts", url: "http://localhost:4101/graphql" },
    { name: "chat", url: "http://localhost:4102/graphql" },
    { name: "note", url: "http://localhost:4103/graphql" },
    { name: "noteExtension", url: "http://localhost:4104/graphql" },
    //{ name: "houzzJukwaa", url: "http://localhost:3333/graphql-internal" }
  ]
});

(async () => {
  const { schema, executor } = await gateway.load();

  const server = new ApolloServer({ schema, executor });

  server.listen( {port: 4001} ).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();
