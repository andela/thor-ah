import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import errorhandler from 'errorhandler';
import log from 'fancy-log';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';
import path from 'path';
import router from './server/routes';
import swaggerDocument from './server/docs/swagger.json';
import './server/config/passport';

const isProduction = process.env.NODE_ENV === 'production';

// Create global app object
const app = express();

app.use(passport.initialize());

app.use(cors());

// swagger api documentation setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Normal express config defaults
app.use(require('morgan')('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());

app.set('views', path.join(__dirname, 'views'));
// set view engine as pug
app.set('view engine', 'pug');

if (!isProduction) {
  app.use(errorhandler());
}
app.use(router);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    log(err.stack);

    res.status(err.status || 500);

    res.json({
      error: {
        message: err.message,
        error: err
      },
      status: 'error'
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(err.status || 500);
  return res.json({
    error: {
      message: err.message,
      error: {}
    },
    status: 'error'
  });
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3000, () => {
  log(`Listening on port ${server.address().port}`);
});

export default app;
