import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'texperia';

console.log('Database config loaded:', {
  uri: uri ? uri.split('@')[0] + '@***' : 'MISSING',
  dbName
});

let client;
let db;

export async function getDb() {
  if (!uri) {
    console.error('MONGODB_URI is not set');
    throw new Error('Missing MONGODB_URI environment variable');
  }

  // Return existing connection if available
  if (db) {
    console.log('Reusing existing database connection');
    return db;
  }

  try {
    if (!client) {
      console.log('Creating new MongoDB client...');
      client = new MongoClient(uri, {
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      
      console.log('Connecting to MongoDB...');
      await client.connect();
      console.log('Successfully connected to MongoDB');
    }

    db = client.db(dbName);
    console.log('Database instance created:', dbName);
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    // Reset on connection failure
    client = null;
    db = null;
    throw error;
  }
}
