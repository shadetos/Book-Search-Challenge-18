import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

const db = async (): Promise<typeof mongoose.connection> => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Database Connected.')
        return mongoose.connection;
    } catch (err: any){
        console.error('Database Connection Error:', err);
        throw new Error('Database connection Failed.');
    }
};

export default db;
