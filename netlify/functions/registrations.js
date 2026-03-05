import { getDb } from './_db.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  try {
    const db = await getDb();
    const docs = await db.collection('registrations').find({}).sort({ created_at: -1 }).toArray();

    const data = docs.map((doc) => ({
      ...doc,
      _id: doc._id?.toString?.() || ''
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message || 'Failed to fetch registrations' })
    };
  }
};
