const handleBlogRouter = require("./src/router/blog.js");
const handleUserRouter = require("./src/router/user.js");

const serverHandle = (req, res) => {
  const url = req.url;
  const path = url.split("?")[0];
  req.path = path;

  res.setHeader("Content-Type", "application/json");

  const blogData = handleBlogRouter(req, res);
  const userData = handleUserRouter(req, res);

  // 处理博客路由
  if (blogData) {
    res.end(JSON.stringify(blogData));
    return;
  }

  if (userData) {
    res.end(JSON.stringify(userData));
    return;
  }

  res.writeHead(404, { "Conetent-Type": "text/plain" });
  res.write("404 NOT FOUMD \n");
  res.end();
};

module.exports = serverHandle;
