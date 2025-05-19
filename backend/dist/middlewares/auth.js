"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyFirebaseToken = void 0;
const firebase_1 = __importDefault(require("../config/firebase"));
const verifyFirebaseToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing or invalid token" });
    }
    const token = authHeader.split("Bearer ")[1];
    try {
        const decodedToken = await firebase_1.default.auth().verifyIdToken(token);
        req.user = decodedToken; // Attach user info to request
        next();
    }
    catch (error) {
        console.error("Firebase Auth Error:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
};
exports.verifyFirebaseToken = verifyFirebaseToken;
