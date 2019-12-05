const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { graphql, parse } = require('graphql');
const express = require('express');
const bodyParser = require("body-parser");
const { addResolveFunctionsToSchema } = require('graphql-tools');

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

let federatedSchema = buildFederatedSchema([
  {
    typeDefs
  }
]);

let executableSchema = addResolveFunctionsToSchema(
{
      schema: federatedSchema,
      resolvers: resolvers,
      resolverValidationOptions: {
          allowResolversNotInSchema: true
      }
});


let handler = (req, res) => {
  console.log('hit!', req.body.query);

  return graphql(
    executableSchema,
    req.body.query,
    {},                 // root value
    {},
    req.body.variables,
    req.body.operationName       // operation name
  ).then(result => {
    res.json(result);
    res.end(200);
  });

};

const server = express();
const port = 4104;

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.post('/graphql', handler);

server.listen(4103, () => {
  console.log(`🚀 GQL Server ready at 4103`);
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
