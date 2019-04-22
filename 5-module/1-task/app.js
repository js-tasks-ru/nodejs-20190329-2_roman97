const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let clients = [];

router.get('/subscribe', async (ctx) => {
  ctx.body = await new Promise((resolve) => {
    clients.push(resolve);

    ctx.req.on('close', () => {
      clients.splice(clients.indexOf(resolve), 1);
    });
  });
});

router.post('/publish', async (ctx) => {
  const {message} = ctx.request.body;

  if (!message) {
    ctx.body = {success: false};
    return;
  }

  clients.forEach((resolve) => {
    resolve(message);
  });
  clients = [];

  ctx.body = {success: true};
});

app.use(router.routes());

module.exports = app;
