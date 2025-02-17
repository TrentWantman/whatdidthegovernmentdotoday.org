const express = require('express');
const router = express.Router();
const { getCongressActions, getBillDetails } = require('../controllers/congressController');

// 1) GET /api/congress/paginated
router.get('/paginated', getCongressActions);

// 2) GET /api/congress/:billSlug
//    e.g. /api/congress/118-hr-146
router.get('/:billSlug', getBillDetails);

module.exports = router;
