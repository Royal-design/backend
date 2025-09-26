export const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.user?.roles) return res.sendStatus(401); // not authenticated

    // Check if user has at least one allowed role
    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));

    if (!hasRole) return res.sendStatus(403); // forbidden

    next();
  };
};
