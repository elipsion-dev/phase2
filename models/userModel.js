const Sequalize=require('sequelize');
const sequelize = require("./index");
const sequelizePaginate = require('sequelize-paginate')

const User = sequelize.define("user", {
  first_name: {
    type: Sequalize.STRING,
    allowNull: false
},
  last_name: {
    type: Sequalize.STRING,
    allowNull: false
  },
  username: {
    type: Sequalize.STRING,
    unique: true,
  },
  email: {
    type: Sequalize.STRING,
    allowNull: false,
    unique: true,
  },
  isEmailConfirmed:{
    type: Sequalize.BOOLEAN,
    defaultValue: false,
  },
  password: {
    type: Sequalize.STRING,
  },
  googleId: {
    type: Sequalize.STRING,
  },
  isLocalAuth:{
    type: Sequalize.BOOLEAN,
    defaultValue: false,
  },
  address: {
    type: Sequalize.STRING
  },
  apt: {
      type: Sequalize.STRING
  },
  city: {
      type: Sequalize.STRING
  },
  zip_code: {
      type: Sequalize.STRING
  },
  state: {
      type: Sequalize.STRING
  },
  country: {
      type: Sequalize.STRING
  },
  phone_number: {
      type: Sequalize.INTEGER
  },
  active: {
      type: Sequalize.TINYINT
  },
});

sequelizePaginate.paginate(User)
module.exports = User;