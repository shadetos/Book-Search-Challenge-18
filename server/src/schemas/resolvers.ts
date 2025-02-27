import {User} from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';

interface AddUserArgs {
    input: {
        username: string;
        email: string;
        password: string;
    }
}

interface LoginUserArgs {
    email: string;
    password: string;
}

interface UserArgs {
    _id?: string;
    username: string;
}

interface BookArgs {
    bookId: string;
}

interface AddBookArgs {
    input: {
        bookId: string;
        title: string;
        authors: string[];
        description: string;
        image: string;
        link: string;
    }
}

const resolvers = {
    Query: {
        users: async () => {
            return User.find().populate('savedBooks')
        },
        user: async(_parent: any, {username}: UserArgs) => {
            return User.findOne({username}).populate('savedBooks');
        },
        me: async (_parent: any, _args: any, context: any) => {
            if(context.user){
                return User.findOne({_id: context.user._id}).populate('savedBooks');
            }
            throw new AuthenticationError('Could not authenticate user.');
        },
    },
    Mutation: {
        addUser: async (_parent: any, {input}: AddUserArgs) => {
            const user = await User.create({...input});

            const token = signToken(user.username, user.password, user._id);

            return {token, user};
        },

        login: async(_parent: any, {email, password}: LoginUserArgs) => {
            const user = await User.findOne({email});

            if(!user){
                throw new AuthenticationError('Could not authenticate user.');
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw){
                throw new AuthenticationError('Could not authenticate user.');
            }

            const token = signToken(user.username, user.password, user._id);

            return {token, user};
        },

        saveBook: async(_parent: any, {input}: AddBookArgs, context: any) => {
            console.log("Received input:", input);
            if(context.user){
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } },
                    {new: true},
                );

                return updatedUser;
            }
            throw AuthenticationError;
            ('You need to be logged in to use this feature!');
        },

        deleteBook: async(_parent: any, {bookId}: BookArgs, context: any) => {
            if(context.user){
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    {new: true},
                ); 

                if(!updatedUser){
                    throw new AuthenticationError('Could not find user!')
                }

                return updatedUser;
            }
            throw AuthenticationError;
            ('You must be logged in to use this feature!');
        }
    }

}

export default resolvers;