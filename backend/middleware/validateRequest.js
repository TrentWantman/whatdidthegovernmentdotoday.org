const { ApiError } = require('./errorHandler');

const validatePagination = (req, res, next) => {
  const { offset = 0, limit = 10 } = req.query;

  const parsedOffset = parseInt(offset);
  const parsedLimit = parseInt(limit);

  if (isNaN(parsedOffset) || parsedOffset < 0) {
    throw new ApiError(400, 'Invalid offset parameter. Must be a non-negative integer.');
  }

  if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
    throw new ApiError(400, 'Invalid limit parameter. Must be between 1 and 100.');
  }

  req.query.offset = parsedOffset;
  req.query.limit = parsedLimit;

  next();
};

const validateBillSlug = (req, res, next) => {
  const { billSlug } = req.params;

  if (!billSlug) {
    throw new ApiError(400, 'Bill slug is required');
  }

  const slugPattern = /^\d{1,3}-[a-z]+-\d+$/i;

  if (!slugPattern.test(billSlug)) {
    throw new ApiError(400, 'Invalid bill slug format. Expected format: congress-type-number (e.g., 118-hr-146)');
  }

  next();
};

module.exports = {
  validatePagination,
  validateBillSlug
};