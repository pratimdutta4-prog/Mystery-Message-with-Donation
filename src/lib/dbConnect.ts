import mongose from 'mongoose';

type ConnectionObject = {
    isConnected?: number
};

const connection: ConnectionObject = {};

export default async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log('>> Already connected with database...');
        return;
    }
    try {
        const db = await mongose.connect(process.env.MONGODB_URI || '', {});

        connection.isConnected = db.connections[0].readyState;

        console.log('>> Database connected successfully...');
    } catch (error) {
        console.error('>> Database connection failed: ', error);
        process.exit(1);
    } 
}
