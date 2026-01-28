const jwt = require('jsonwebtoken');

// this middleware verifies if user is logged in
exports.protect = (req, res, next) => {
    let token;
    // check if token exists in the headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // get token from string "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            //verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //add the user data (id and role) to the req object
            req.user = decoded;

            // move to the next function
            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }
    if(!token){
        res.status(401).json({message:"Not authorized, no token"});
    }
};

// THis middleware checks for specific roles (admin/head)
exports.authorize = (...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({ 
                message: `Role ${req.user.role} is not allowed to access this route` 
            });
        }
            next();
    };
};
