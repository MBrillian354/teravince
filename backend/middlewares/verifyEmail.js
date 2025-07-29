module.exports = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({ msg: 'Please verify your email' });
  }
  next();
};
