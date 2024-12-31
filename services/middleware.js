var jwt = require("jsonwebtoken");

const middlewareRoutine = (req, res, next) => {
  let { token } = req.headers;
  console.log(token);
  if (!token) {
    return res.status(401).json({ expired: false, message: "Unauthorized" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    console.log(err, decoded);
    if (err) {
      return res
        .status(401)
        .json({
          message: "Session Expired or Violated",
          expired: true,
          authorized: false,
        });
    }
    req.roll = decoded.user.roll;
    req.role = decoded.user.role;
    console.log("middleware crossed");
    next();
  });
};

module.exports = middlewareRoutine;
