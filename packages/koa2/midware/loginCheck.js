const { ErrorModel } = require('../model/resModel');

module.exports = async(ctx, next) => {
  if(!ctx.session.username) {
    ctx.body = new ErrorModel('未登录');
    return;
  }

  await next();
}