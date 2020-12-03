const logger = require('../services/logger.service');

async function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    res.status(401).end('Unauthorized!');
    return;
  }
  next();
}

async function requireOwner(req, res, next) {
  const user = req.session.user;
  if (user.userType !== 'owner') {
    res.status(403).end('Only owner is authorized!');
    return;
  }
  next();
}

// async function requireAdmin(req, res, next) {
//   const user = req.session.user;
//   if (!user.isAdmin) {
//     res.status(403).end('Unauthorized Enough..');
//     return;
//   }
//   next();
// }


// module.exports = requireAuth;

module.exports = {
  requireAuth,
  // requireAdmin,
  requireOwner
}
