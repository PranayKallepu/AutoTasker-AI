"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const auth_1 = require("firebase-admin/auth");
const app_1 = require("firebase-admin/app");
// Initialize Firebase Admin if not already initialized
if (!(0, app_1.getApps)().length) {
    (0, app_1.initializeApp)({
        credential: (0, app_1.cert)({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
    });
}
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await (0, auth_1.getAuth)().verifyIdToken(token);
        // Add user ID to request object
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
        };
        next();
    }
    catch (error) {
        console.error("Auth middleware error:", error);
        res.status(401).json({ error: "Unauthorized" });
    }
};
exports.authMiddleware = authMiddleware;
