const { readData, createUpdateDelete } = require("../helpers/Promise/PromiseModule");
const PromiseModule = require("../helpers/Promise/PromiseModule");

const examQueries = {
    getAllExamInfo,
    insertNewExamDetails,
    insertNewQuestion,
    insertExamQuestionRelQuery,
    insertOptionQuestionRelQuery,
    insertNewOption,
    searchExamForUser,
    setUserGivenExamDetails,
    getExamDeailsWithOptions,
    saveGivenExamInfo,
    getAllExamsOfUserByID
}

async function getAllExamInfo() {
    const sqlQuery = "SELECT * FROM exam";
    return readData(sqlQuery);
}

async function insertNewExamDetails(inputArray) {
    const sqlQuery = "INSERT INTO exam (main_exam_id, marks_id, subject_id, topic_id, exam_type_id, time_id) VALUES (?)"
    return createUpdateDelete(sqlQuery, inputArray)
}

async function insertNewQuestion(inputArray) {
    const sqlQuery = "INSERT INTO question (details, is_description, correct_answer_key) VALUES(?)"
    return createUpdateDelete(sqlQuery, inputArray);
}

async function insertExamQuestionRelQuery(inputArray) {
    const sqlQuery = "INSERT INTO exam_question_rel (exam_id, question_id) VALUES ?"
    return createUpdateDelete(sqlQuery, inputArray)
}

async function insertNewOption(inputArray){
    const sqlQuery = "INSERT INTO options (opt_nm, details, is_description) VALUES(?)"
    return createUpdateDelete(sqlQuery, inputArray)
}

async function insertOptionQuestionRelQuery(inputArray) {
    const sqlQuery = "INSERT INTO question_option_rel (question_id, option_id) VALUES ?"
    return createUpdateDelete(sqlQuery, inputArray);
}

async function searchExamForUser(inputObject) {
    const {main_exam_id, marks_id, subject_id, topic_id, exam_type_id, time_id} = inputObject
    const sqlQuery = `SELECT id FROM exam WHERE main_exam_id = ${main_exam_id} AND marks_id = ${marks_id} AND subject_id = ${subject_id} AND topic_id = ${topic_id} AND exam_type_id = ${exam_type_id} AND time_id = ${time_id} ORDER BY exam.timestamp DESC`
    return readData(sqlQuery)
}

async function setUserGivenExamDetails(inputArray) {
    const sqlQuery = "INSERT INTO exam_details (user_id, exam_id) VALUES (?)"
    return createUpdateDelete(sqlQuery, inputArray)
}

async function getExamDeailsWithOptions(examId) {  
    const sqlQuery = `(SELECT exam_question_rel.exam_id AS exam_id, exam_question_rel.question_id AS question_id, join_question.option_id AS option_id, join_question.question_details AS question_details, join_question.question_is_description AS question_is_description, join_question.correct_answer_key AS correct_answer_key, join_question.options_opt_nm AS options_opt_nm, join_question.options_details AS options_details, join_question.options_is_description AS options_is_description, join_question.question_explanation AS question_explanation, join_question.explain_is_description AS explain_is_description, join_exam.exam_duration AS exam_duration FROM exam_question_rel LEFT JOIN( SELECT question_id, option_id, join1.details AS question_details, join1.is_description AS question_is_description, join1.correct_answer_key AS correct_answer_key, join1.explanation AS question_explanation, join1.explain_is_description AS explain_is_description, join2.opt_nm AS options_opt_nm, join2.details AS options_details, join2.is_description AS options_is_description FROM question_option_rel LEFT JOIN question AS join1 ON 1 LEFT JOIN options AS join2 ON 1 WHERE join1.id = question_option_rel.question_id AND join2.id = question_option_rel.option_id ) AS join_question ON 1 LEFT JOIN (SELECT join_time.duration AS exam_duration FROM exam LEFT JOIN time AS join_time ON 1 WHERE exam.time_id = join_time.id AND exam.id = ${examId}) AS join_exam ON 1 WHERE exam_question_rel.question_id = join_question.question_id AND exam_question_rel.exam_id = ${examId})`;
    return readData(sqlQuery)
}

async function saveGivenExamInfo(inputObj) {
    const {total_answered, total_corrects, total_wrongs, userId, examId} = inputObj
    const sqlQuery = `UPDATE exam_details SET total_answered = ${total_answered}, total_corrects = ${total_corrects}, total_wrongs = ${total_wrongs} WHERE exam_details.user_id = ${userId} AND exam_details.exam_id = ${examId}`;
    return readData(sqlQuery)
}

async function getAllExamsOfUserByID(userId) {
    const sqlQuery = `SELECT exam_details.exam_id AS exam_id, exam_details.total_answered AS total_answered, exam_details.total_corrects AS total_corrects, exam_details.total_wrongs AS total_wrongs, join_exam.total_marks AS total_marks FROM exam_details LEFT JOIN ( SELECT join1.number AS total_marks, exam.id AS exam_id FROM exam LEFT JOIN marks AS join1 ON 1 WHERE exam.marks_id = join1.id ) AS join_exam ON 1 WHERE exam_details.exam_id = join_exam.exam_id AND exam_details.user_id = ${userId}`
    return readData(sqlQuery)
}
module.exports = examQueries;