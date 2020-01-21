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
const User = require('./models/user');
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);



mongoose
  .connect(process.env.MONGOLAB_URI, {useNewUrlParser: true})
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

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: (24 * 60 * 60 * 1000) },
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);

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
app.use(passport.initialize());

passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession)
    .then(userDocument => {
      cb(null, userDocument);
    })
    .catch(err => {
      cb(err);
    })
});

//Google Auth
passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/login/google/callback"
  },

  (accessToken, refreshToken, profile, done) => {
    console.log("Google account details:", profile);


     User.findOne({ googleID: profile.id })
       .then(user => {
         if (user) {
          return done(null, user);
        
         }
         User.create({ username: profile.displayName, email: profile._json.email, googleID: profile.id, avatarURL: profile.photos[0].value })           
         .then(newUser => {
             return done(null, newUser);

           })
           .catch(err => done(err)); // closes User.create()
       })
       .catch(err => done(err)); // closes User.findOne()
   }

) 
);


// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';


//authorization
const login = require('./routes/auth/login');
app.use('/login', login);

const signup = require('./routes/auth/signup');
app.use('/signup', signup);

const logout = require('./routes/auth/logout');
app.use('/logout', logout);


//private routing
const main_private = require('./routes/private/main_private');
app.use('/main', main_private);

const event_creator = require('./routes/private/event_creator');
app.use('/event_create', event_creator);

const event_details = require('./routes/private/event_details');
app.use('/event', event_details);

const player_editor = require('./routes/private/player_editor');
app.use('/user_editor', player_editor);

const player_details = require('./routes/private/player_details');
app.use('/user_details', player_details);


//dev playground
const lol = require('./routes/playground/lol');
app.use('/lol', lol);
/*
//app.get('/test-route', (req, res, next) => res.send('<a href="#">You are inside /test-route</a>'))

*/
//main unauthorized
const index = require('./routes/index');
app.use('/', index);


module.exports = app;
