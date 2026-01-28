const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAllUsers, toggleBlockUser } = require('../controllers/adminController');

// Only Admins can access these
const adminCheck = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') next();
    else res.status(403).json({ message: "Not Authorized" });
};

router.get('/users', protect, adminCheck, getAllUsers);
router.patch('/block', protect, adminCheck, toggleBlockUser);

module.exports = router;