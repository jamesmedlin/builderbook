const passport = require('passport');
const Strategy = require('passport-google-oauth').OAuth2Strategy;
const Customer = require('./models/Customer');

function setupGoogle({ server, ROOT_URL }) {
  const verify = async (accessToken, refreshToken, profile, verified) => {
    let email;
    let avatarUrl;

    if (profile.emails) {
      email = profile.emails[0].value;
    }

    if (profile.photos && profile.photos.length > 0) {
      avatarUrl = profile.photos[0].value.replace('sz=50', 'sz=128');
    }

    try {
      const customer = await Customer.signInOrSignUp({
        googleId: profile.id,
        email,
        googleToken: { accessToken, refreshToken },
        displayName: profile.displayName,
        avatarUrl,
      });
      verified(null, customer);
    } catch (err) {
      verified(err);
      console.log(err); // eslint-disable-line
    }
  };
  passport.use(
    new Strategy(
      {
        clientID: process.env.GOOGLE_CLIENTID,
        clientSecret: process.env.GOOGLE_CLIENTSECRET,
        callbackURL: `${ROOT_URL}/oauth2callback`,
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
      },
      verify,
    ),
  );

  passport.serializeUser((customer, done) => {
    done(null, customer.id);
  });

  passport.deserializeUser((id, done) => {
    Customer.findById(id, Customer.publicFields(), (err, customer) => {
      done(err, customer);
      // eslint-disable-next-line no-console
      // console.log('deserializeUser', id);
    });
  });

  server.use(passport.initialize());
  server.use(passport.session());

  server.get('/auth/google', (req, res, next) => {
    const options = {
      scope: ['profile', 'email'],
      prompt: 'select_account',
    };
    // eslint-disable-next-line
      console.log(`req.query.redirectUrl:${req.query.redirectUrl}`);

    if (req.query && req.query.redirectUrl && req.query.redirectUrl.startsWith('/')) {
      req.session.finalUrl = req.query.redirectUrl;
    } else {
      req.session.finalUrl = null;
    }

    passport.authenticate('google', options)(req, res, next);
  });

  server.get(
    '/oauth2callback',
    passport.authenticate('google', {
      failureRedirect: '/login',
    }),
    (req, res) => {
      // eslint-disable-next-line
      console.log(`req.session.finalUrl:${req.session.finalUrl}`);

      if (req.user && req.user.isAdmin) {
        res.redirect('/dashboard');
      } else if (req.session.finalUrl) {
        res.redirect(`${ROOT_URL}${req.session.finalUrl}`);
      } else {
        // eslint-disable-next-line
        res.redirect('/dashboard');
      }
    },
  );

  server.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/home');
  });
}

module.exports = setupGoogle;

// Check if need googleToken as field for User data model
