const User = require('../db/model/User');
const { genPassword } = require('../utils/cryp');

const login = async (username, password) => {
  const user = await User.findOne({
    where: {
      username,
      password: genPassword(password),
    }
  });

  if(!user) {
    return null;
  }

  return user.dataValues;
};

module.exports = {
  login,
};
