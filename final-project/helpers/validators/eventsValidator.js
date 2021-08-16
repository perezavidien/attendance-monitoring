import AttendanceDatastore from '../../dataAccess/attendance/attendanceDatastore.js';

export const hasMemberAttendance = async (id) => {
    const attendanceDataStore = new AttendanceDatastore();
    const data = await attendanceDataStore.getByEventId(id);

    console.log(data);

    if (data)
        return true;
    return false;
}