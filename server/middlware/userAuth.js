require("dotenv").config();
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ success: false, msg: "Not authorized, login again" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({ success: false, msg: "Invalid token" });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, msg: error.message });
  }
};

module.exports = { userAuth };
