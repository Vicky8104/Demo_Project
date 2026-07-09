export const isAdmin = (req, res, next) => {
    // console.log("CHECK ADMIN ROLE:", req.user); // 🔥
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied" });
  }
  next();
};