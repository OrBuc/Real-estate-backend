import { Router } from "express";
import { getProperties, createProperty, updateProperty, deleteProperty } from "../controllers/propertyController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// נתיבים ציבוריים (ללא אימות)
router.get("/", getProperties); // כולם יכולים לראות נכסים

// נתיבים מוגנים (דורשים אימות)
router.post("/", authenticateToken, createProperty);
router.put("/:id", authenticateToken, updateProperty);
router.delete("/:id", authenticateToken, deleteProperty);

export default router;
