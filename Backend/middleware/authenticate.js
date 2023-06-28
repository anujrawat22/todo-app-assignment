const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    const decoded = jwt.verify(token, process.env.privatekey);

    if (decoded) {
      req.userId = decoded.userId;
      next();
    } else {
      res.status(401).json({ msg: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ msg: "Unauthorized" });
  }
};

module.exports = { authenticate };
