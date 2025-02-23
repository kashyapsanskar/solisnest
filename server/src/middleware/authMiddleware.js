
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();


const authenticate = (req, res, next) => {
 
  console.log("🔹 Authorization Header:", req.header('Authorization'));

 
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    console.log("❌ No token provided.");
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
   
    console.log("✅ Decoded Token:", decoded);

  
    req.user = { email: decoded.email || decoded.username };

  
    console.log("🔹 Extracted User:", req.user);

    next();  
  } catch (err) {
    console.log("❌ JWT Verification Error:", err.message);
    return res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authenticate;
