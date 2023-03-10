const { readData, createUpdateDelete } = require("../helpers/Promise/PromiseModule");

const infoQueries = {
    getAllMarksInfo,
    insertNewMark,
    updateMarks,
    getAllMainExamInfo,
    insertNewMainExam,
    updateMainExam,
    getAllExamTypeInfo,
    insertNewExamType,
    updateExamType,
    getAllSubjectInfo,
    insertNewSubject,
    updateSubject,
    getAllTimeInfo,
    insertNewTime,
    updateTime,
    getAllTopicInfo,
    insertNewTopic,
    updateTopic,
    getAllPlans,
    insertNewPlan,
    updatePlan,
    getAllNotices,
    insertNewNotice,
    updateNotice,
    getAllSyllabuses,
    insertNewSyllabus,
    updateSyllabus
}

async function getAllMarksInfo() {
    const sqlQuery = "SELECT * FROM marks";
    return readData(sqlQuery);
}

module.exports = infoQueries;