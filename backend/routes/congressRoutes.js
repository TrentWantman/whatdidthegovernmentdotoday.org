const express = require("express");
const router = express.Router();
const {
  getCongressData,
  getCongressActions,
  getBillDetails,
  searchBills,
  getBillSummary,
  getMembers
} = require("../controllers/congressController");
const { validatePagination, validateBillSlug } = require("../middleware/validateRequest");
const { cacheMiddleware } = require("../middleware/cache");

/**
 * @swagger
 * /api/congress:
 *   get:
 *     summary: Get recent congressional bills
 *     description: Retrieve the most recent congressional bills with pagination
 *     tags: [Bills]
 *     parameters:
 *       - $ref: '#/components/parameters/offsetParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/sortParam'
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         bills:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Bill'
 *                         pagination:
 *                           $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.get("/", validatePagination, cacheMiddleware(300), getCongressData);

/**
 * @swagger
 * /api/congress/actions:
 *   get:
 *     summary: Get congressional actions
 *     description: Retrieve congressional actions with detailed pagination
 *     tags: [Actions]
 *     parameters:
 *       - $ref: '#/components/parameters/offsetParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/sortParam'
 *       - name: congress
 *         in: query
 *         description: Filter by congress session
 *         schema:
 *           type: integer
 *       - name: chamber
 *         in: query
 *         description: Filter by chamber
 *         schema:
 *           type: string
 *           enum: [house, senate]
 *       - name: billType
 *         in: query
 *         description: Filter by bill type
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get("/actions", validatePagination, cacheMiddleware(180), getCongressActions);

/**
 * @swagger
 * /api/congress/search:
 *   get:
 *     summary: Search congressional bills
 *     description: Search for bills using various criteria
 *     tags: [Search]
 *     parameters:
 *       - name: query
 *         in: query
 *         description: Search query string
 *         schema:
 *           type: string
 *       - name: congress
 *         in: query
 *         description: Filter by congress session
 *         schema:
 *           type: integer
 *       - name: chamber
 *         in: query
 *         description: Filter by chamber
 *         schema:
 *           type: string
 *           enum: [house, senate]
 *       - name: billType
 *         in: query
 *         description: Filter by bill type
 *         schema:
 *           type: string
 *       - name: sponsor
 *         in: query
 *         description: Filter by sponsor name
 *         schema:
 *           type: string
 *       - $ref: '#/components/parameters/offsetParam'
 *       - $ref: '#/components/parameters/limitParam'
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request - at least one search parameter required
 */
router.get("/search", validatePagination, searchBills);

/**
 * @swagger
 * /api/congress/members:
 *   get:
 *     summary: Get members of Congress
 *     description: Retrieve current members of Congress
 *     tags: [Members]
 *     parameters:
 *       - name: chamber
 *         in: query
 *         description: Chamber of Congress
 *         schema:
 *           type: string
 *           enum: [house, senate]
 *           default: house
 *       - $ref: '#/components/parameters/offsetParam'
 *       - $ref: '#/components/parameters/limitParam'
 *     responses:
 *       200:
 *         description: List of Congress members
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get("/members", validatePagination, cacheMiddleware(3600), getMembers);

/**
 * @swagger
 * /api/congress/bill/{billSlug}:
 *   get:
 *     summary: Get bill details
 *     description: Retrieve detailed information about a specific bill
 *     tags: [Bills]
 *     parameters:
 *       - name: billSlug
 *         in: path
 *         required: true
 *         description: Bill identifier in format congress-type-number (e.g., 118-hr-146)
 *         schema:
 *           type: string
 *           pattern: '^\\d{3}-[a-z]+(-\\d+)?$'
 *           example: '118-hr-146'
 *     responses:
 *       200:
 *         description: Bill details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Bill'
 *       400:
 *         description: Invalid bill slug format
 *       404:
 *         description: Bill not found
 */
router.get("/bill/:billSlug", validateBillSlug, cacheMiddleware(600), getBillDetails);

/**
 * @swagger
 * /api/congress/bill/{billSlug}/summary:
 *   get:
 *     summary: Get bill summary
 *     description: Retrieve summary information for a specific bill
 *     tags: [Bills]
 *     parameters:
 *       - name: billSlug
 *         in: path
 *         required: true
 *         description: Bill identifier
 *         schema:
 *           type: string
 *           example: '118-hr-146'
 *     responses:
 *       200:
 *         description: Bill summary
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get("/bill/:billSlug/summary", validateBillSlug, cacheMiddleware(600), getBillSummary);

// Legacy route for backward compatibility
router.get("/paginated", validatePagination, getCongressActions);

module.exports = router;
