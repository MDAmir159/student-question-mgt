const { readData, createUpdateDelete } = require("../helpers/Promise/PromiseModule")

const userLoginQueries = {
    getUserDetailsById,
    getNormalUserDetailsById,
    getLoggedIn,
    insertNewUser,
    updateUserInfo
}

async function getUserDetailsById(inputObject) {
    const {loggedInUserId, database} = inputObject
    const sqlQuery = `SELECT * FROM ${database} WHERE id = "${loggedInUserId}"`
    return readData(sqlQuery)
}

async function getNormalUserDetailsById(userId) {
    const sqlQuery = `SELECT name, bn_name, plan_id, email, mobile, image_link, ever_subscribed, last_paid, joined_at FROM user WHERE id = ${userId}`;
    return readData(sqlQuery);
}

async function getLoggedIn(inputObject) {
    const {mobile, database} = inputObject
    const sqlQuery = `SELECT id, mobile, email, password FROM ${database} WHERE mobile = "${mobile}"`
    return readData(sqlQuery)
}

async function insertNewUser(inputArray) {
    const sqlQuery = "INSERT INTO user (mobile, password) VALUES (?)"
    return createUpdateDelete(sqlQuery, inputArray)
}

async function updateUserInfo(inputObject) {
    const {userId, name, bn_name, email, mobile, password, image_url} = inputObject
    const sqlQuery = `UPDATE user SET name = "${name}", bn_name = "${bn_name}" , email = "${email}", mobile = "${mobile}", password = "${password}", image_link = "${image_url}" WHERE user.id = ${userId}`;
    return readData(sqlQuery);
}
module.exports = userLoginQueries

          