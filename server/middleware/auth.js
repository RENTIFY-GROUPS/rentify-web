const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    // Get token from header
    const token = req.header("x-auth-token");

    // Check if no token
    if (!token) {
        return res
            .status(401)
            .json({ message: "No token, authorization denied" });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

function adminAuth(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
}

module.exports = { auth, adminAuth };
