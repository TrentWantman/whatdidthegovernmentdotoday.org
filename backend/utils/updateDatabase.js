const axios = require('axios');
const Bill = require('../models/Bill');

const updateDatabase = async () => {
  const apiKey = process.env.CONGRESS_API_KEY;
  const limit = 100; // Number of bills per page
  let offset = 0;
  let totalAdded = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  const bulkOps = [];

  try {
    console.log('🔄 Starting Full Sync with Bulk Operations...');

    while (true) {
      const response = await axios.get('https://api.congress.gov/v3/bill', {
        headers: { 'X-API-Key': apiKey },
        params: { format: 'json', limit, offset },
      });

      const bills = response.data.bills;
      if (!bills || bills.length === 0) break;

      for (const bill of bills) {
        bulkOps.push({
          updateOne: {
            filter: { congress: bill.congress, number: bill.number },
            update: {
              $set: {
                type: bill.type,
                title: bill.title,
                originChamber: bill.originChamber,
                latestAction: {
                  text: bill.latestAction.text,
                  actionDate: bill.latestAction.actionDate,
                },
                updateDate: bill.updateDate,
                url: bill.url,
              },
            },
            upsert: true,
          },
        });
      }

      // Execute Bulk Write Every 100 Operations
      if (bulkOps.length >= 100) {
        const result = await Bill.bulkWrite(bulkOps, { ordered: false });
        totalAdded += result.upsertedCount || 0;
        totalUpdated += result.modifiedCount || 0;
        bulkOps.length = 0;
        console.log(`✅ Bulk Sync: Added ${totalAdded}, Updated ${totalUpdated}`);
      }

      offset += limit;
      if (!response.data.pagination?.next) break;
    }

    // Final Bulk Write (remaining ops)
    if (bulkOps.length > 0) {
      const finalResult = await Bill.bulkWrite(bulkOps, { ordered: false });
      totalAdded += finalResult.upsertedCount || 0;
      totalUpdated += finalResult.modifiedCount || 0;
    }

    console.log(`🚀 Full Sync Completed`);
    console.log(`🟢 Total Added: ${totalAdded}`);
    console.log(`🟡 Total Updated: ${totalUpdated}`);
    console.log(`⚪ Total Skipped (No Changes): ${totalSkipped}`);
  } catch (error) {
    console.error(` Full Sync Error: ${error.message}`);
  }
};

module.exports = updateDatabase;
