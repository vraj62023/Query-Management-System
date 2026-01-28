const User = require('../models/User');
const Query = require('../models/Query');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        //check if user already exists 
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        //Hash the password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create the user in the db
        //i hardcoded the user role to be participant to prevent users form making themselvels as admin
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'PARTICIPANT'
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//login a user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("login attempt:", email);

        //Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.isBlocked) {
            return res.status(403).json({ message: "Your account has been blocked by Admin." });
        }
        //compare the typed and hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // if matched , generate a jwt token
        const token = jwt.sign(
            { id: user._id, role: user.role }, // data stored in the token
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }

        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
// Get all Team Heads + their active query count
exports.getTeamHeads = async (req, res) => {
    try {
        const heads = await User.find({ role: 'HEAD' }).select('-password');

        const headsWithCounts = await Promise.all(heads.map(async (head) => {
            // Count 1: How many are currently on their plate?
            const activeCount = await Query.countDocuments({
                assignedTo: head._id,
                status: 'ASSIGNED'
            });

            // Count 2: How many have they finished?
            const resolvedCount = await Query.countDocuments({
                assignedTo: head._id,
                status: 'RESOLVED'
            });

            return {
                ...head._doc,
                activeTasks: activeCount,
                resolvedTasks: resolvedCount // <--- sending this new number
            };
        }));

        res.status(200).json(headsWithCounts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching heads" });
    }
};
// Add this new function
exports.getMe = async (req, res) => {
    try {
        // req.user is already there because of the 'protect' middleware
        const user = await User.findById(req.user.id).select('-password');

        res.status(200).json({
            success: true,
            user: user
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
