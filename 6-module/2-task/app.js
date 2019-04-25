const Koa = require('koa');
const Router = require('koa-router');
const isValidObjectId = require('./libs/isValidObjectId');
const getValidationErrors = require('./libs/getValidationErrors');
const User = require('./models/User');

const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});

const router = new Router();

router.get('/users', async (ctx) => {
  ctx.body = await User.find({});
});

router.get('/users/:id', async (ctx) => {
  const {id} = ctx.params;

  if (!isValidObjectId(id)) {
    ctx.throw(400, 'Bad request');
  }

  const user = await User.findById(id);

  if (user) {
    ctx.body = user;
  }
});

router.patch('/users/:id', async (ctx) => {
  const {
    params: {id},
    request: {body},
  } = ctx;

  if (!isValidObjectId(id)) {
    ctx.throw(400, 'Bad request');
  }

  const user = await User.findById(id);

  if (user) {
    user.email = body.email || user.email;
    user.displayName = body.displayName || user.displayName;

    await user
        .save()
        .then(
            (user) => ctx.body = user,
            (error) => {
              const errors = getValidationErrors(error.errors);

              ctx.status = 400;
              ctx.body = {
                errors,
              };
            },
        );
  }
});

router.post('/users', async (ctx) => {
  const {email, displayName} = ctx.request.body;

  await User.create({
    email,
    displayName,
  }).then(
      (user) => ctx.body = user,
      (error) => {
        const errors = getValidationErrors(error.errors);

        ctx.status = 400;
        ctx.body = {
          errors,
        };
      },
  );
});

router.delete('/users/:id', async (ctx) => {
  const {id} = ctx.params;

  if (!isValidObjectId(id)) {
    ctx.throw(400, 'Bad request');
  }

  const user = await User.findById(id);

  if (user) {
    user.remove();
    ctx.body = user;
  }
});

app.use(router.routes());

module.exports = app;
