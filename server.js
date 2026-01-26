require('dotenv').config();
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
},
  function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

// HTML Template Helper
function renderPage(title, content) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <div class="container">
        <div class="card">
            ${content}
        </div>
        <div class="footer">
            &copy; 2026 OAuth Security Research
        </div>
    </div>
</body>
</html>
  `;
}

app.get('/', (req, res) => {
  const content = `
    <div class="badge badge-info">Security Research</div>
    <h1>Welcome</h1>
    <p>Secure authentication demonstration with dynamic redirection capabilities.</p>
    <a href="/auth/google?returnTo=/dashboard" class="btn-google">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.79l7.97-6.2z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        <path fill="none" d="M0 0h48v48H0z"/>
      </svg>
      Sign in with Google
    </a>
  `;
  res.send(renderPage('Login', content));
});

app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    const content = `
      <div class="badge badge-warning">Authenticated</div>
      <h1>Dashboard</h1>
      <p>Welcome back, ${req.user.displayName}!</p>
      <p style="font-size: 0.9rem;">You have successfully logged in via Google OAuth.</p>
      <a href="/" class="btn-google" style="background: #f1f5f9; color: #475569;">Logout</a>
    `;
    res.send(renderPage('Dashboard', content));
  } else {
    res.redirect('/');
  }
});

app.get('/auth/google', (req, res, next) => {
  const returnTo = req.query.returnTo || '/dashboard';
  const state = JSON.stringify({ returnTo });

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: state
  })(req, res, next);
});

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    try {
      const state = JSON.parse(req.query.state);
      const returnTo = state.returnTo;
      console.log(`Redirecting to: ${returnTo}`);
      res.redirect(returnTo);
    } catch (e) {
      res.redirect('/dashboard');
    }
  }
);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
