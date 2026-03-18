const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    res.originalJson = res.json;
    res.json = (body) => {
      res.originalJson(body);
      if (res.statusCode === 200) {
        cache.set(key, body, duration);
      }
    };

    next();
  };
};

const clearCache = () => {
  cache.flushAll();
};

module.exports = {
  cacheMiddleware,
  clearCache,
  cache
};
