const express = require('express');
const router = express.Router();
// Add resolveQuery to your imports
const { 
    createQuery, 
    getUserQueries,
    getAllQueries, 
    assignQuery, 
    resolveQuery,
    getAssignedQueries,
    escalateQuery, 
    reopenQuery
} = require('../controllers/queryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createQuery); // POST /api/queries/
router.get('/my', protect, getUserQueries); // GET /api/queries/my
router.patch('/assign', protect, authorize('ADMIN'), assignQuery);
router.patch('/resolve', protect, authorize('HEAD','ADMIN'), resolveQuery);
// Get work assigned to me
router.get('/assigned', protect, authorize('HEAD'), getAssignedQueries);
router.get('/all', protect, authorize('ADMIN'), getAllQueries);
// 1. Head Escalate
router.patch('/escalate', protect, authorize('HEAD'), escalateQuery);

// 2. Participant Reopen
router.patch('/reopen', protect, authorize('PARTICIPANT'), reopenQuery);
module.exports = router;