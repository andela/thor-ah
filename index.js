import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import errorhandler from 'errorhandler';
import log from 'fancy-log';
import swaggerUi from 'swagger-ui-express';

import router from './server/routes';
import swaggerDocument from './server/docs/swagger.json';


const isProduction = process.env.NODE_ENV === 'production';

// Create global app object
const app = express();

app.use(cors());

// swagger api documentation setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Normal express config defaults
app.use(require('morgan')('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());

app.use(express.static(`${__dirname}/public`));

app.use(
  session({
    secret: 'authorshaven',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

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
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(err.status || 500);
  return res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3000, () => {
  log(`Listening on port ${server.address().port}`);
});

<<<<<<< HEAD
export default app;
=======
module.exports = app;
>>>>>>> 3abec737d5c9cf4e9e271bed04f8e4c075e72ef1
