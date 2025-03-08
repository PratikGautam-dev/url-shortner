const mongoose = require('mongoose');

async function connectToMongoose(url) {
    return mongoose.connect(url);
}

async function testConnection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connection successful');
        // Test write permission
        const testDoc = await mongoose.connection.db.collection('test').insertOne({ test: true });
        await mongoose.connection.db.collection('test').deleteOne({ _id: testDoc.insertedId });
        console.log('Write permission verified');
        return true;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        return false;
    }
}

module.exports = { connectToMongoose, testConnection };