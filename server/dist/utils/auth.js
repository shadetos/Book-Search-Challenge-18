import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const authenticateToken = ({ req }) => {
    let token = req.body.token || req.query.token || req.headers.authorization;
    if (req.headers.authorization) {
        token = token.split(' ').pop().trim();
    }
    if (!token) {
        return req;
    }
    try {
        const { data } = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '2hr' });
        // If the token is valid, attach the user data to the request object
        req.user = data;
    }
    catch (err) {
        console.log('Invalid token');
    }
    return req;
};
export const signToken = (username, email, _id) => {
    const payload = { username, email, _id };
    const secretKey = process.env.JWT_SECRET_KEY || '';
    return jwt.sign({ data: payload }, secretKey, { expiresIn: '2h' });
};
export class AuthenticationError extends GraphQLError {
    constructor(message) {
        super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
        Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
    }
}
;
