const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET || "secretKey";

const autehnticate = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization)
      return res.status(401).json({ error: "Authentication failed" });
    const [type, token] = authorization.split(" ");
    if (type !== "Bearer")
      return res.status(401).json({ error: "Authentication failed" });

    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({error: err});
  }
};

module.exports = autehnticate;
