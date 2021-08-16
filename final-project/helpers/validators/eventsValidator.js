import AttendanceDatastore from '../../dataAccess/attendance/attendanceDatastore.js';

export const hasMemberAttendance = (id) => {
    const attendanceDataStore = new AttendanceDatastore();
    const data = attendanceDataStore.getByEventId(id);

    if (data || data.length > 0)
        return true;

    return false;
}