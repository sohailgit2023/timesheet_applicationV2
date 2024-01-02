module.exports.validationError = (resp, error = 'Data provided is not valid') => {
    addHeaders(resp);

    resp.statusCode = 422;

    resp.end(JSON.stringify({
        status: 'fail',
            error
    }, null, 3));
};

module.exports.error = (resp, error = 'An unknown error occurred', statusCode = 500) => {
    addHeaders(resp);

    resp.statusCode = statusCode;

    resp.end(JSON.stringify({
        status: 'fail',
        error
    }, null, 3));
};

module.exports.success = (resp, data = null) => {
    addHeaders(resp);

    resp.statusCode = 200;
//    resp.writeHead(200, { 'Content-Type': 'application/json' });
    
    resp.end(JSON.parse({
        data
    }, null, 3));
};

const addHeaders = (resp) => {
    return resp.setHeader('Content-Type', 'application/json');
}