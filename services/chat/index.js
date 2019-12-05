const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { graphql, parse } = require('graphql');
const express = require('express');
const bodyParser = require("body-parser");
const { addResolveFunctionsToSchema } = require('graphql-tools');

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

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.post('/graphql', handler);

server.listen(4102, () => {
  console.log(`🚀 GQL Server ready at 4102`);
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
