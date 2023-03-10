const dotenv = require("dotenv");
dotenv.config()
module.exports = {
  HOST: process.env.API_HOST,
  USER: "root",
  PASSWORD: process.env.API_PASSWORD,
  DATABASE: "",
  CONNECTION_LIMIT: 25,
  PORT: 5000,
  ACCESS_TOKEN_SECRET:process.env.ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_SECRET:process.env.REFRESH_TOKEN_SECRET,
  EMAIL:process.env.API_EMAIL,
  EMAIL_PASSWORD:process.env.API_EMAIL_PASSWORD,
  BASE_LINK : process.env.BASE_LINK
};
