import { gql } from "@apollo/client";

export const QUERY_USER = gql`
    query user($username: String!) {
        user(username: $username) {
        _id
        username
        email
        savedBooks {
                _id
                bookId
                title
                authors
                description
                image
            }
        }
    }
`;

export const QUERY_ME = gql`
    query me {
        me {
            _id
            username
            email
            savedBooks {
                _id
                bookId
                title
                authors
                description
                image
            }
        }
    }
`;