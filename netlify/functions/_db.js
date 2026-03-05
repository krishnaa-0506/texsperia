import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'texperia';

let client;
let db;

export async function getDb() {
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable');
  }

  if (db) {
    return db;
  }

  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }

  db = client.db(dbName);
  return db;
}
