const User = require('../../models/User');

module.exports = function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, 'Не указан email');
  }

  User.findOne({email}, async (err, user) => {
    if (err) {
      return done(err);
    }

    if (user) {
      return done(null, user);
    }

    User.create({
      email,
      displayName,
    }, (err, user) => {
      if (!err) {
        return done(null, user);
      }

      if (err.name !== 'ValidationError') {
        throw err;
      }

      return done(err, false);
    });
  });
};
