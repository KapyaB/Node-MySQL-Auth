// Use bcryptjs for password hashing
const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");

// Create a user model
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define("User", {
    // unique identifier. workaroud for the easy-to-guess int ids
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false
    },

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
    },

    // is the account currently active? either unverified or user requested to delete. kept in active for 2 weeks utmost, then deleted.
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
  User.removeAttribute("id");

  // Creating custom method for user model. This checks if an unhashed password matches the hashed password stored in the database.
  User.prototype.validPassword = password => {
    // 'this' refers to the current instance of the user
    return bcrypt.compareSync(password, this.password);
  };

  // Hooks are automatic methods that run during various phases of the User Model lifecycle. In this case, before the user is created, we automatically generate a uuid
  // Can also be used for hashing the password, but i have gone with the controller file.
  User.addHook("beforeCreate", user => {
    // user is the user object submitted on creation
    user.uuid = Sequelize.UUIDV1;
  });

  return User;
};
