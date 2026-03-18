const axios = require('axios');
const { ApiError } = require('../middleware/errorHandler');
const { cacheMiddleware } = require('../middleware/cache');

const CONGRESS_API_BASE = 'https://api.congress.gov/v3';

const congressApiRequest = async (endpoint, params = {}) => {
  const apiKey = process.env.CONGRESS_API_KEY;

  if (!apiKey) {
    throw new ApiError(500, 'Congress API key not configured');
  }

  try {
    const response = await axios.get(`${CONGRESS_API_BASE}${endpoint}`, {
      headers: { 'X-API-Key': apiKey },
      params: {
        format: 'json',
        ...params
      },
      timeout: 10000
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new ApiError(
        error.response.status,
        `Congress API error: ${error.response.data?.message || error.message}`
      );
    } else if (error.request) {
      throw new ApiError(503, 'Congress API is unavailable');
    } else {
      throw new ApiError(500, `Request failed: ${error.message}`);
    }
  }
};

exports.getCongressData = async (req, res, next) => {
  try {
    const { limit = 10, offset = 0, sort = 'updateDate+desc' } = req.query;

    const data = await congressApiRequest('/bill', {
      offset,
      limit,
      sort
    });

    const { bills, pagination } = data || {};

    const enrichedBills = bills?.map(bill => {
      const congress = bill.congress || bill.originChamber || 'unknown';
      const type = bill.type?.toLowerCase() || 'unknown';
      const number = bill.number || Math.floor(Math.random() * 10000);

      const isValidSlug = congress !== 'unknown' && type !== 'unknown' && bill.number;

      return {
        ...bill,
        slug: isValidSlug ?
          `${congress}-${type}-${number}` :
          `invalid-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        shortTitle: bill.title?.substring(0, 100) + (bill.title?.length > 100 ? '...' : ''),
        lastAction: bill.latestAction
      };
    }) || [];

    res.json({
      success: true,
      data: {
        bills: enrichedBills,
        pagination: {
          count: pagination?.count || 0,
          hasNext: !!pagination?.next,
          next: pagination?.next || null,
          offset: parseInt(offset),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getCongressActions = async (req, res, next) => {
  try {
    const { offset = 0, limit = 5, sort = 'updateDate+desc' } = req.query;

    const data = await congressApiRequest('/bill', {
      offset,
      limit,
      sort
    });

    const { bills, pagination } = data || {};

    const actionsWithDetails = bills?.map(bill => {
      const congress = bill.congress || bill.originChamber || 'unknown';
      const type = bill.type?.toLowerCase() || 'unknown';
      const number = bill.number || Math.floor(Math.random() * 10000);

      const isValidSlug = congress !== 'unknown' && type !== 'unknown' && bill.number;

      return {
        ...bill,
        slug: isValidSlug ?
          `${congress}-${type}-${number}` :
          `invalid-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        actions: bill.latestAction ? [bill.latestAction] : [],
        status: bill.latestAction?.actionDate ? 'active' : 'pending'
      };
    }) || [];

    res.json({
      success: true,
      data: {
        bills: actionsWithDetails,
        pagination: {
          count: pagination?.count || 0,
          hasNext: !!pagination?.next,
          next: pagination?.next || null,
          offset: parseInt(offset),
          limit: parseInt(limit),
          totalPages: Math.ceil((pagination?.count || 0) / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getBillDetails = async (req, res, next) => {
  try {
    const { billSlug } = req.params;
    const [congress, rawType, billNumber] = billSlug.split('-');
    const billType = (rawType || '').toLowerCase();

    const [billData, actionsData, summariesData] = await Promise.all([
      congressApiRequest(`/bill/${congress}/${billType}/${billNumber}`),
      congressApiRequest(`/bill/${congress}/${billType}/${billNumber}/actions`).catch(() => null),
      congressApiRequest(`/bill/${congress}/${billType}/${billNumber}/summaries`).catch(() => null)
    ]);

    const enrichedBill = {
      ...billData.bill,
      actions: actionsData?.actions || [],
      summaries: summariesData?.summaries || [],
      slug: billSlug,
      sponsors: billData.bill?.sponsors || [],
      committees: billData.bill?.committees || [],
      relatedBills: billData.bill?.relatedBills || []
    };

    res.json({
      success: true,
      data: enrichedBill
    });
  } catch (error) {
    next(error);
  }
};

exports.searchBills = async (req, res, next) => {
  try {
    const {
      query,
      congress,
      chamber,
      billType,
      sponsor,
      sort = 'updateDate+desc',
      offset = 0,
      limit = 20
    } = req.query;

    let endpoint = '/bill';
    const searchParams = {
      offset,
      limit,
      sort
    };

    if (congress && billType) {
      endpoint = `/bill/${congress}/${billType.toLowerCase()}`;
    } else if (congress) {
      searchParams.congress = congress;
    }

    if (query) {
      searchParams.query = query;
    }

    const data = await congressApiRequest(endpoint, searchParams);
    const { bills, pagination } = data || {};

    let filteredBills = bills || [];

    // Apply client-side filtering for parameters not supported by the API
    if (chamber) {
      filteredBills = filteredBills.filter(bill => {
        const billType = bill.type?.toLowerCase();
        const isHouseBill = billType?.startsWith('h') || bill.originChamber === 'House';
        const isSenateBill = billType?.startsWith('s') || bill.originChamber === 'Senate';

        return chamber === 'house' ? isHouseBill : isSenateBill;
      });
    }

    if (sponsor) {
      filteredBills = filteredBills.filter(bill => {
        const sponsors = bill.sponsors || [];
        return sponsors.some(s =>
          s.firstName?.toLowerCase().includes(sponsor.toLowerCase()) ||
          s.lastName?.toLowerCase().includes(sponsor.toLowerCase()) ||
          s.fullName?.toLowerCase().includes(sponsor.toLowerCase())
        );
      });
    }

    const enrichedBills = filteredBills.map(bill => {
      const congress = bill.congress || bill.originChamber || 'unknown';
      const type = bill.type?.toLowerCase() || 'unknown';
      const number = bill.number || Math.floor(Math.random() * 10000);

      const isValidSlug = congress !== 'unknown' && type !== 'unknown' && bill.number;

      return {
        ...bill,
        slug: isValidSlug ?
          `${congress}-${type}-${number}` :
          `invalid-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        shortTitle: bill.title?.substring(0, 100) + (bill.title?.length > 100 ? '...' : ''),
        lastAction: bill.latestAction
      };
    });

    // Chamber and sponsor are filtered client-side so pagination is unreliable when they're active
    const usingClientFilter = !!(chamber || sponsor);
    const totalCount = usingClientFilter ? filteredBills.length : (pagination?.count || 0);
    const parsedLimit = parseInt(limit);

    res.json({
      success: true,
      data: {
        bills: enrichedBills,
        pagination: {
          count: totalCount,
          hasNext: usingClientFilter ? false : !!pagination?.next,
          offset: parseInt(offset),
          limit: parsedLimit,
          totalPages: usingClientFilter ? 1 : Math.ceil(totalCount / parsedLimit)
        },
        searchCriteria: { query, congress, chamber, billType, sponsor }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getBillSummary = async (req, res, next) => {
  try {
    const { billSlug } = req.params;
    const [congress, rawType, billNumber] = billSlug.split('-');
    const billType = (rawType || '').toLowerCase();

    const data = await congressApiRequest(`/bill/${congress}/${billType}/${billNumber}/summaries`);

    res.json({
      success: true,
      data: {
        summaries: data.summaries || [],
        billSlug
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getMembers = async (req, res, next) => {
  try {
    const { chamber = 'house', limit = 20, offset = 0 } = req.query;

    const data = await congressApiRequest(`/member/${chamber}`, {
      offset,
      limit,
      currentMember: true
    });

    res.json({
      success: true,
      data: {
        members: data.members || [],
        pagination: {
          count: data.pagination?.count || 0,
          hasNext: !!data.pagination?.next,
          offset: parseInt(offset),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
