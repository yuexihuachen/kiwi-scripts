const Koa = require('koa');
const app = new Koa();
const helmet = require('koa-helmet')
const nunjucks = require("nunjucks")
// logger

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src":["'self'", "'unsafe-inline'", "'unsafe-eval'", 'http://localhost:*', 'http://*.kiwi.com:*', 'https://*.kiwi.com']
      },
    },
  }))

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  //ctx.set('Cross-Origin-Resource-Policy', `cross-origin`);
});

// response

app.use(async ctx => {
  const html = nunjucks.renderString(`<!DOCTYPE html>
  <html lang="en">
  <head>
      <title>My Webpage</title>
  </head>
  <body>
  
      <h1>My Webpage</h1>
      <script src="http://localhost:7975/bundle.js" crossorigin="anonymous"></script>
  </body>
  </html>`)
  ctx.body = html
});

app.listen(3000);