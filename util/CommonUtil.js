module.exports.cleanData = async (data) => {
    return JSON.parse(JSON.stringify(data));
};