const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { graphql, parse } = require('graphql');
const express = require('express');
const bodyParser = require("body-parser");
const { addResolveFunctionsToSchema } = require('graphql-tools');

const typeDefs = gql`
    directive @mock(variant: String) on FIELD
    directive @first(n: Int) on FIELD
    directive @seo(method: String, pageType: SEO_PAGE_TYPES, defaultValue: String) on FIELD

    enum SEO_PAGE_TYPES {
        HOME
        BROWSE_PHOTOS
        PHOTOS_LANDING
        BROWSE_PRODUCTS
        PRODUCTS_LANDING
        BROWSE_DISCUSSIONS
        BROWSE_PROFESSIONALS
        BROWSE_SERVICES
        BROWSE_STORIES
        VIEW_PHOTO
        VIEW_PRODUCT
        VIEW_QUESTION
        VIEW_PROFILE
        JOBS_PAGE
        TEAM_PAGE
        CITY_PAGE
        NEWS_PAGE
        PRO_SOLUTIONS_HOME
    }

    extend type Query {
        topNotes(first: Int = 5): [Note]
    }

    type Note @key(fields: "id") {
        id: Int
        content: String
        ownerId: Int
        price: Int
        weight: Int
    }
`;

const resolvers = {
    Note: {
        __resolveReference(object) {
            console.log("DEMO Note resolveReference");
            console.log(object);
            let product = products.find(product => product.id === object.id);
            console.log(product);
            return product;
        }
    },
    Query: {
        topNotes(_, args) {
            console.log(args);
            return products.slice(0, args.first);
        },
    }
};

let executableSchema = buildFederatedSchema([
  {
    typeDefs,
    resolvers
  }
]);


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
