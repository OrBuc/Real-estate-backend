import Property from "../models/Property.js";

// קבלת כל הנכסים או נכסי משתמש מסוים
export async function getProperties(req, res) {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const properties = await Property.find(filter).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// יצירת נכס חדש (דורש אימות)
export async function createProperty(req, res) {
  try {
    console.log("=== CREATE PROPERTY REQUEST ===");
    console.log("req.user:", req.user);
    console.log("req.body:", req.body);
    console.log("req.headers.authorization:", req.headers.authorization);
    
    // בדיקה שהמשתמש מאומת
    if (!req.user || !req.user.userId) {
      console.log("❌ No user authentication found");
      return res.status(401).json({ message: "Authentication required" });
    }

    // המשתמש המאומת מגיע מ-middleware
    const userId = req.user.userId;
    console.log("✅ Creating property for user:", userId);
    
    const property = await Property.create({ ...req.body, userId });
    console.log("✅ Property created:", property._id);
    
    res.status(201).json(property);
  } catch (error) {
    console.error("❌ Error creating property:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// עדכון נכס (רק הבעלים)
export async function updateProperty(req, res) {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // בדיקה שהמשתמש הוא הבעלים
    if (property.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// מחיקת נכס (רק הבעלים)
export async function deleteProperty(req, res) {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // בדיקה שהמשתמש הוא הבעלים
    if (property.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Property deleted", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
