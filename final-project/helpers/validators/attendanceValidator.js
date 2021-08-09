import { ErrorHandler } from '../errorHandler.js'

export const recordExists = (data) => {
    return Object.keys(data).length > 0;
}

export const displayResponse = (res, data) => {
    if (!recordsExists(data)) {
        throw new ErrorHandler(404)
    }
    res.send(data);
}