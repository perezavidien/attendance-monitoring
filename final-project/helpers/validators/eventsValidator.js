import AttendanceDatastore from '../../dataAccess/attendance/attendanceDatastore.js';
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

export const hasMemberAttendance = (id) => {
    const attendanceDataStore = new AttendanceDatastore();
    const data = attendanceDataStore.getByEventId(id);

    if (data || data.length > 0)
        return true;

    return false;
}