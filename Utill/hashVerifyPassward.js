let bcrypt = require('bcryptjs');

exports.hashPassword = async (password) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (err) {
      throw new Error(err);
    }
  }

  exports.verifyPassward = async (plainTextPassword,hashedPasswordFromDatabase) => {
    try {
        const result = await bcrypt.compare(plainTextPassword, hashedPasswordFromDatabase);
        return result;
      } catch (err) {
        throw new Error(err);
      }
  }