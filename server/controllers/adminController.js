const User = require('../models/User');
const Query = require('../models/Query');

// Get All Users (Heads & Participants) with stats
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'ADMIN' } }).select('-password');
        
        // Optional: Attach stats (e.g., how many tickets a Head has)
        const usersWithStats = await Promise.all(users.map(async (u) => {
            let stats = {};
            if (u.role === 'HEAD') {
                stats.active = await Query.countDocuments({ assignedTo: u._id, status: 'ASSIGNED' });
                stats.resolved = await Query.countDocuments({ assignedTo: u._id, status: 'RESOLVED' });
            } else if (u.role === 'USER') {
                stats.totalQueries = await Query.countDocuments({ submittedBy: u._id });
            }
            return { ...u._doc, stats };
        }));

        res.json(usersWithStats);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Toggle Block Status
exports.toggleBlockUser = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.role === 'ADMIN') return res.status(403).json({ message: "Cannot block Admin" });

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.json({ message: `User ${user.isBlocked ? 'Blocked' : 'Unblocked'}`, user });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};