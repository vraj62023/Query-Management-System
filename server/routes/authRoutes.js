const express = require('express');
const router = express.Router();
const {register}= require('../controllers/authController');
const {login, getMe, getTeamHeads}= require('../controllers/authController');
const { protect,authorize } = require('../middleware/authMiddleware');


// This creates the path : POST/api/auth/register
router.post('/register',register);
router.post('/login',login);
router.get('/me', protect, getMe);
router.get('/secret', protect, (req, res) => {
    res.send(`Hello ${req.user.role}, you are inside the protected area!`);
});
router.get('/heads', protect, authorize('ADMIN'), getTeamHeads);



module.exports = router;