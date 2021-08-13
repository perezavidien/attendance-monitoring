import { ErrorHandler } from '../errorHandler.js'

export const recordExists = (data) => {
    return Object.keys(data).length > 0;
}

export const displayResponse = (res, data) => {
    if (!recordExists(data)) {
        throw new ErrorHandler(404)
    }

    res.send(data);
}

export const hasMemberAttendance = (data) => {
    if (data.memberAttendance && data.memberAttendance.length > 0)
        return true;
    return false;
}