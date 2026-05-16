const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // User role check
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not allowed to access this resource`,
      });
    }

    next();
  };
};

module.exports = authorizeRoles;