const querystring = require('querystring');

const handleBlogRouter = require("./src/router/blog.js");
const handleUserRouter = require("./src/router/user.js");

const getPostData = (req, res) => {
  return new Promise((resolve) => {
    if(req.method !== 'POST') {
      resolve({});
      return;
    }
    if(req.headers['content-type'] !== 'apllication/json') {
      resolve({});
      return;
    }

    let postData = '';

    res.on('data', chunk => {
      postData += chunk.toString();
    });

    res.on('end', () => {
      if(!postData) {
        resolve({});
        return;
      }
      resolve(
        JSON.stringify(postData)
      )
    })
  })
}

const serverHandle = (req, res) => {
  const url = req.url;
  const path = url.split("?")[0];
  req.path = path;
  req.query = querystring.parse(url.split('?')[1]);

  res.setHeader("Content-Type", "application/json");

  const blogData = handleBlogRouter(req, res);
  const userData = handleUserRouter(req, res);
  
  getPostData(req).then((postData) => {
    req.body = postData;

    // 处理博客路由
    if (blogData) {
      res.end(JSON.stringify(blogData));
      return;
    }

    // 处理用户路由
    if (userData) {
      res.end(JSON.stringify(userData));
      return;
    }

    res.writeHead(404, { "Conetent-Type": "text/plain" });
    res.write("404 NOT FOUMD \n");
    res.end();
  });
};

module.exports = serverHandle;
