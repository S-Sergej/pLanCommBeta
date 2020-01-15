require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

mongoose
  .connect('mongodb://localhost/plancomm', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

//Google Auth
passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    // to see the structure of the data in received response:
    console.log("Google account details:", profile);

    User.findOne({ googleID: profile.id })
      .then(user => {
        if (user) {
          done(null, user);
          return;
        }
        User.create({username: profile.displayName, email: profile._json.Object.value(email), googleID: profile.id })
          .then(newUser => {
            console.log(newUser);
            done(null, newUser);

          })
          .catch(err => done(err)); // closes User.create()
      })
      .catch(err => done(err)); // closes User.findOne()
  }
)
);

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';


const auth = require('./routes/auth');
app.use('/auth', auth);


const index = require('./routes/index');
app.use('/', index);


module.exports = app;
