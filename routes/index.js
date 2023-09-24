const router = require('express').Router();
const { errors } = require('celebrate');

const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const routeSignup = require('./auth/signup');
const routeSignin = require('./auth/signin');
const NotFound = require('../utils/errors/NotFound');
const { ERROR_INTERNAL_SERVER } = require('../utils/http_codes');

// не требует авторизации
router.use('/signup', routeSignup);
router.use('/signin', routeSignin);

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use('*', (req, res, next) => {
  next(new NotFound('Такой страницы не существует'));
});

router.use(errors()); // handle errors by celebrate

router.use((err, req, res, next) => {
  const { statusCode = ERROR_INTERNAL_SERVER, message } = err; // 500 by default
  res.status(statusCode).send({ message });

  next();
});

module.exports = router;
