const authorize = (...roles) => {
  return async (req, res, next) => {
    const role = req.user.role;
    roles.includes(role)
      ? next()
      : res.status(403).json({ error: "Forbidden" });
  };
};

module.exports = authorize;
