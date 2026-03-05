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
    const collection = db.collection('registrations');

    const totalRegistrations = await collection.countDocuments();
    const day1Count = await collection.countDocuments({ participation_day: 'day1' });
    const day2Count = await collection.countDocuments({ participation_day: 'day2' });

    const totalRevenueAgg = await collection.aggregate([
      { $group: { _id: null, total: { $sum: '$payment_amount' } } }
    ]).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        stats: {
          totalRegistrations,
          day1Count,
          day2Count,
          totalRevenue: totalRevenueAgg[0]?.total || 0
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message || 'Failed to fetch stats' })
    };
  }
};
