const typeDefs = `
    type User {
        _id: ID
        username: String
        email: String
        password: String
        savedBooks: [Book]!
    }

    type Book {
        _id: ID
        bookId: String
        title: String
        authors: [String]!
        description: String
        image: String
    }

    input UserInput {
        username: String!
        email: String!
        password: String!
    }

    input BookInput {
        bookId: String
        title: String
        authors: [String]!
        description: String
        image: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        users: [User]
        user(username: String!): User
        me: User
    }

    type Mutation {
        addUser(input: UserInput!): Auth
        login(email: String!, password: String!): Auth
        saveBook(input: BookInput!): User
        deleteBook(bookId: String!): User
    }
`;

export default typeDefs;