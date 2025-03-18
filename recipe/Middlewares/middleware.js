require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../Models/UserModel');
const TokenBlacklist = require('../Models/TokenBlacklist'); 

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWTSECRET, { expiresIn: '1d' });
};

const checkToken = async (req, res, next) => {
    console.log('entered here');
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(403).json({ message: "Login first" });
        }

        const token = authHeader.split(" ")[1]; 

        if (!token) {
            return res.status(403).json({ message: "A token is required" });
        }

        // Check if blacklisted
        const blacklisted = await TokenBlacklist.findOne({ token });
        if (blacklisted) {
            return res.status(403).json({ message: "Token has been invalidated" });
        }

        const decode = jwt.verify(token, process.env.JWTSECRET);
        const user = await User.findById(decode.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
        
    } catch (err) {
        return res.status(401).json({ message: "Error in the token checking", err });
    }
};

const checkRole = (requiredRoles) => async (req, res, next) => {
    try {
        const convertedRoles = requiredRoles.map(role => role.toLowerCase());
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userRole = user.role;
        if (!convertedRoles.includes(userRole.toLowerCase())) {
            return res.status(403).json({ message: "You are unauthorized" });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: 'Authorization error occurred', err });
    }
};

const deleteToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(400).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(400).json({ message: "Invalid token format" });
        }

      
        const decode = jwt.verify(token, process.env.JWTSECRET);

     
        const existing = await TokenBlacklist.findOne({ token });
        if (existing) {
            return res.status(200).json({ message: "Token already invalidated" });
        }

    
        await TokenBlacklist.create({
            token,
            expiresAt: new Date(decode.exp * 1000) 
        });

        return res.status(200).json({ 
            message: "Token invalidated successfully"
        });

    } catch (err) {
        return res.status(401).json({ 
            message: "Error in token deletion", 
            error: err.message 
        });
    }
};

module.exports = { createToken, checkToken, checkRole, deleteToken };