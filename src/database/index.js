'use server'
const mongoose = require('mongoose'); // CommonJS import

export async function ConnectDb() {
    
    try {
        // Make sure the Mongoose connection is established with await
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('Database connection error:', err);
    }
}
