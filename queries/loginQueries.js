const PromiseModule = require("../helpers/Promise/PromiseModule");

const logInQueries = {
    logInQuery
}

async function logInQuery(inputArray) {
    const sqlQuery = "SELECT * FROM `user` WHERE email = ?";
    return PromiseModule.readDataWithCondition(sqlQuery, inputArray);
}

module.exports = logInQueries;