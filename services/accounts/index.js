const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

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


    type NoteTest @key(fields: "id") {
        id: Int
        content: String
        ownerId: Int
    }
`;

const resolvers = {
    NoteTest: {
        __resolveReference(object) {
            console.log("DEMO NoteTest resolveReference");
            console.log(object);
            const notes = [
                {
                    id: 1,
                    content: "Table",
                },
                {
                    id: 2,
                    content: "Couch",
                },
                {
                    id: 3,
                    content: "Chair",
                }
            ];

            let note = notes.find(note => note.id === object.id);
            console.log(note);
            return note;
        },
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

server.listen({ port: 4101 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const users = [
  {
    id: "1",
    name: "Ada Lovelace",
    birthDate: "1815-12-10",
    username: "@ada"
  },
  {
    id: "2",
    name: "Alan Turing",
    birthDate: "1912-06-23",
    username: "@complete"
  }
];
