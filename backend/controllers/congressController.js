const axios = require('axios');
const Bill = require('../models/Bill'); 
/**
 * 1) getCongressActions - for listing a page of bills
 *    e.g. GET /api/congress/paginated?offset=0&limit=5
 */
exports.getCongressActions = async (req, res) => {
  const apiKey = process.env.CONGRESS_API_KEY;
  const { offset = 0, limit = 5 } = req.query;

  try {
    // Call the official Congress API
    const response = await axios.get('https://api.congress.gov/v3/bill', {
      headers: { 'X-API-Key': apiKey },
      params: {
        format: 'json',
        offset,
        limit,
      },
    });

    const { bills, pagination } = response.data || {};

    // OPTIONAL: Cache in MongoDB. If ignoring DB, remove this block.
    /*
    if (bills) {
      const bulkOps = bills.map((b) => ({
        updateOne: {
          filter: { number: b.number, congress: b.congress },
          update: {
            $set: {
              // store fields...
            },
          },
          upsert: true,
        },
      }));
      if (bulkOps.length > 0) {
        await Bill.bulkWrite(bulkOps);
      }
    }
    */

    res.json({
      bills: bills || [],
      pagination: {
        count: pagination?.count || 0,
        next: pagination?.next || null,
      },
    });
  } catch (error) {
    console.error('❌ API Error (paginated):', error.message);
    res.status(500).json({ error: 'Failed to fetch congressional actions' });
  }
};

/**
 * 2) getBillDetails - fetch details for a single slug (e.g. "118-hr-146")
 *    Splits into [118, 'hr', '146'] => calls Congress.gov => returns JSON
 */
exports.getBillDetails = async (req, res) => {
  const apiKey = process.env.CONGRESS_API_KEY;
  const { billSlug } = req.params; // "118-hr-146"
  const [congress, rawType, billNumber] = billSlug.split('-');
  const billType = (rawType || '').toLowerCase(); // ensure lowercase

  try {
    // OPTIONAL: DB check if ignoring DB, remove
    /*
    const dbBill = await Bill.findOne({ congress, number: billNumber });
    if (dbBill) {
      console.log('Serving Bill from DB cache');
      return res.json(dbBill);
    }
    */

    // Query Congress.gov
    const response = await axios.get(
      `https://api.congress.gov/v3/bill/${congress}/${billType}/${billNumber}`,
      {
        headers: { 'X-API-Key': apiKey },
        params: { format: 'json' },
      }
    );

    // Return the official data
    res.json(response.data);
  } catch (error) {
    console.error('❌ API Error (bill details):', error.message);
    res.status(500).json({ error: 'Failed to fetch bill details' });
  }
};
