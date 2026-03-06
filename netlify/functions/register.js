import { getDb } from './_db.js';

export const handler = async (event) => {
  console.log('Register function called:', { method: event.httpMethod, path: event.path });
  
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  try {
    console.log('Parsing request body...');
    const body = JSON.parse(event.body || '{}');
    console.log('Request body parsed successfully');
    
    const registrationId = `REG${Date.now()}`;

    const document = {
      ...body,
      registration_id: registrationId,
      created_at: new Date().toISOString()
    };

    console.log('Connecting to database...');
    const db = await getDb();
    console.log('Database connected, inserting document...');
    
    await db.collection('registrations').insertOne(document);
    console.log('Document inserted successfully:', registrationId);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, registrationId, message: 'Registration saved successfully' })
    };
  } catch (error) {
    console.error('Register function error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message || 'Failed to save registration' })
    };
  }
};
