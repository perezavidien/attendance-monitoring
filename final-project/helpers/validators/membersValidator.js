export const hasEventAttendance = (data) => {
    if (data.eventAttendance && data.eventAttendance.length > 0)
        return true;
    return false;
}