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
    
  extend type Note @key(fields: "id") {
    id: Int @external
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

server.listen(4104, () => {
  console.log(`🚀 GQL Server ready at 4104`);
});

const inventory = [
  { id: 111, inStock: true },
  { id: 222, inStock: false },
  { id: 333, inStock: true }
];
