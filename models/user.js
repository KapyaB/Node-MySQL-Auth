// Use bcryptjs for password hashing
const bcrypt = require("bcryptjs");

// Create a user model
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define("User", {
    // email can't be null and should be valid
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },

    // Password cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  // Creating custom method for user model. This checks if an unhashed password matches the hashed password stored in the database.
  User.prototype.validPassword = password => {
    // 'this' refers to the current instance of the user
    return bcrypt.compareSync(password, this.password);
  };

  // Hooks are automatic methods that run during various phases of the User Model lifecycle. In this case, before hte user is created, we automatically hash the password
  User.addHook("beforeCreate", user => {
    // user is the user object submitted on creation
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(10),
      null
    );
  });

  return User;
};
