import { ErrorHandler } from '../errorHandler.js'

export const recordExists = (data) => {
    console.log('inside recordExists');
    console.log(Object.keys(data).length);

    return Object.keys(data).length > 0;
}

export const displayResponse = (res, data) => {
    if (!recordExists(data)) {
        throw new ErrorHandler(404)
    }
    res.send(data);
}