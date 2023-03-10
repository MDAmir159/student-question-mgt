const PromiseModule = require("../helpers/Promise/PromiseModule");

const signUpQueries = {
    addNewMember
}

async function addNewMember(inputArray) {

    const sqlQuery = "INSERT INTO user (name,email,mobile_number,password,class_id,institute,district_id,present_address,image) VALUES(?)";
    return PromiseModule.createUpdateDelete(sqlQuery, inputArray);
}

module.exports = signUpQueries;