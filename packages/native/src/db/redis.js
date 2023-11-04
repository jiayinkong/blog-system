const redis = require('redis')
const { REDIS_CONF } = require('../conf/db');

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.hosts);

// 连接，启动之后立刻执行
!(async function() {
  await redisClient.connect()
    .then(() => {
      console.log('redis connect success!');
    })
    .catch(console.error)
})()


// set
async function set(key, val) {
  let objVal;
  if(typeof val === 'object') {
    objVal = JSON.stringify(objVal);
  } else {
    objVal = val;
  }
  await redisClient.set(key, objVal);
}

// get
async function get(key) {
  try {
    let value = await redisClient.get(key);

    if(value == null) {
      return value;
    }

    try {
      value = JSON.parse(value); // 尝试转换为 JS 对象
    } catch (error) {
    }

    return value;

  } catch (error) {
    throw error;
  }
}


module.exports = {
  set,
  get,
}
