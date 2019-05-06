/* eslint-disable */
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
  { usernameField: 'email', session: false, },
  function(email, password, done) {

    User.findOne({email: email}, async (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, 'Нет такого пользователя');
      }

      const isPasswordValid = await user.checkPassword(password);

      if (!isPasswordValid) {
        return done(null, false, 'Невереный пароль');
      }

      return done(null, user);
    });
  }
);
