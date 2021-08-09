import { ErrorHandler } from '../errorHandler.js'

export const recordsExists = (data) => {
    return Object.keys(data).length > 0;
}

export const displayResponse = (res, data) => {
    if (!recordsExists(data)) {
        throw new ErrorHandler(404)
    }

    if (hasMemberAttendance) {
        throw new ErrorHandler(400);
    }

    res.send(data);
}

export const hasMemberAttendance = (res, data) => {
    // todo 
}