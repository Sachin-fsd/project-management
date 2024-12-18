const mongoose = require('mongoose'); // CommonJS import

export async function ConnectDb() {
    const url = 'mongodb+srv://sachineducational:sachin@cluster0.mybvg88.mongodb.net/project_management?retryWrites=true&w=majority';
    
    try {
        // Make sure the Mongoose connection is established with await
        await mongoose.connect(url);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('Database connection error:', err);
    }
}
