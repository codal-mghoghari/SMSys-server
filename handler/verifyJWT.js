const jwt = require("jsonwebtoken");
require("dotenv/config");

function verifyJWT(req, res, next) {
    try {
        const secret = process.env.secretKey;
        const token = req?.headers["authorization"]?.split(" ")[1];
        const tokenDecoded = jwt.verify(token, secret);
        if (process.env.NODE_ENV !== "test" && Date.now() >= tokenDecoded.exp * 1000) {
            return res.status(401).json({message: "Unauthorized"});
        }
        req.currentUser = tokenDecoded.userData;
        next();
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
}

module.exports = verifyJWT;