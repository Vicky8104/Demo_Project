import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  // console.log("HEADERS:", req.headers.authorization); 

     const token = req.headers.authorization?.split(" ")[1];
  //  console.log("TOKEN IN MIDDLEWARE:", token); 


  
  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //  console.log("DECODED USER:", decoded); // 🔥 DEBUG
    req.user = decoded;
    next();
  } catch (err) {
      //  console.log("TOKEN ERROR:", err.message); // 🔥 DEBUG
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
