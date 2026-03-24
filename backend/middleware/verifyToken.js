const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  if (!authHeader.startsWith("Bearer ")) {
  return res.status(401).json({ message: "Invalid token format" });
  }
  const token = authHeader.split(" ")[1]; // Expect Bearer <token>
  
  if (!token) return res.status(401).json({ message: "Token missing" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.userId = decoded.id;
    req.post = decoded.post;
    req.subject = decoded.subject;
    next();
  });
}

module.exports = { verifyToken };
