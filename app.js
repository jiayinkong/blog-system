const querystring = require('querystring');
const { set, get } = require('./src/db/redis');
const { access } = require('./src/utils/log');
const handleBlogRouter = require("./src/router/blog.js");
const handleUserRouter = require("./src/router/user.js");

// 设置 cookie 的过期时间
const setCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000));

  return d.toGMTString();
}

// 响应头设置 cookie
const setResponseCookie = (res, userId) => {
  // httpOnly，只允许后端修改 cookie，不允许前端改；设置过期时间
  res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${setCookieExpires()};`);
}

// 用于处理 post data
const getPostData = (req, res) => {
  return new Promise((resolve) => {
    if(req.method !== 'POST') {
      resolve({});
      return;
    }
    if(req.headers['content-type'] !== 'application/json') {
      resolve({});
      return;
    }

    let postData = '';

    req.on('data', chunk => {
      postData += chunk.toString();
    });

    req.on('end', () => {
      
      if(!postData) {
        resolve({});
        return;
      }
      resolve(
        JSON.parse(postData)
      )
    })
  })
}

// session 数据
// const SESSION_DATA = {};

const serverHandle = async (req, res) => {
  // 记录 access log
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

  // 设置返回格式
  res.setHeader("Content-Type", "application/json");

  // CORS 跨域
  // 允许跨域
  res.setHeader('Access-Control-Allow-Credentials', true); 
  // 允许跨域的 origin，* 代表所有
  res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5002');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // 获取 path
  const url = req.url;
  const path = url.split("?")[0];
  req.path = path;

  // 解析 query
  req.query = querystring.parse(url.split('?')[1]);

  // 解析 cookie
  req.cookie = {};
  const cookieStr = req.headers.cookie || ''; // k1=v1;k2=v2;
  cookieStr.split(';').forEach(item => {
    if(!item) return;

    const arr = item.split('=');
    const [key, value] = arr;

    req.cookie[key.trim()] = value.trim();
  });

  // // 解析 session
  // let needSetCookie = false;
  // let userId = req.cookie.userId;
  // if(userId) {
  //   if(!SESSION_DATA[userId]) {
  //     SESSION_DATA[userId] = {};
  //   }
  // } else {
  //   needSetCookie = true;
  //   userId = `${Date.now()}_${Math.random()}`;
  //   SESSION_DATA[userId] = {};
  // }
  // // 拿到 session 数据
  // req.session = SESSION_DATA[userId];

  // 解析 session（使用redis）
  let needSetCookie = false;
  let userId = req.cookie.userId;
  if(!userId) {
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;
    await set(userId, JSON.stringify({}));
  }
  req.sessionId = userId;
  let sessionData = await get(req.sessionId);
  if(sessionData == null) {
    set(req.sessionId, JSON.stringify({}));
    req.session = {};
  } else {
    req.session = sessionData;
  }

  const postData = await getPostData(req);
  req.body = postData;

  const blogData = await handleBlogRouter(req, res);
  const userData = await handleUserRouter(req, res);

  // 处理博客路由
  if (blogData) {
    if(needSetCookie) {
      // 把 userId 存到响应头 cookie 返回给客户端
      setResponseCookie(res, userId);
    }
    res.end(JSON.stringify(blogData));
    return;
  }

  // 处理用户路由
  if (userData) {
    if(needSetCookie) {
      // 把 userId 存到响应头 cookie 返回给客户端
      setResponseCookie(res, userId);
    }
    res.end(JSON.stringify(userData));
    return;
  }

  res.writeHead(404, { "Conetent-Type": "text/plain" });
  res.write("404 NOT FOUMD \n");
  res.end();
};

module.exports = serverHandle;
