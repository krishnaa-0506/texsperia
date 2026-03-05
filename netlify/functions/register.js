import { getDb } from './_db.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const registrationId = `REG${Date.now()}`;

    const document = {
      ...body,
      registration_id: registrationId,
      created_at: new Date().toISOString()
    };

    const db = await getDb();
    await db.collection('registrations').insertOne(document);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, registrationId, message: 'Registration saved successfully' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message || 'Failed to save registration' })
    };
  }
};
