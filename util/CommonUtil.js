module.exports.getPaginated = async (size, page) => {
    page = page - 1;
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return {limit, offset};
    //this will skip offset previous data if page is greater then 1
};

module.exports.pagination = async (data, page, limit) => {
    const {count: totalItems, rows: results} = data;
    //calculate next page current page and last page
    //current page
    const currentPage = page ? +page : 1;
    const totalPage = Math.ceil(totalItems / limit); //this will return total pages bases on page limit and records
    const lastPage = totalPage;

    return {results, totalItems, currentPage, lastPage, totalPage};
};

module.exports.updateData = async (key, newData, defaultData) => {
    let data = null;
    if (key in newData) {
        data = newData[key];
    } else {
        data = defaultData;
    }
    return data;
};

module.exports.cleanData = async (data) => {
    return JSON.parse(JSON.stringify(data));
};