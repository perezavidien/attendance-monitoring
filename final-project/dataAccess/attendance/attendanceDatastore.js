import lowdb from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';

const moduleURL = path.dirname(fileURLToPath(import.meta.url));
const dbAsync = lowdb(new FileAsync(path.join(moduleURL, 'attendanceDb.json')));

export default class AttendanceDatastore {
    constructor() {
        this.tableName = 'attendance';
        this.dbContext = dbAsync.then(db => {
            db.defaults({ [this.tableName]: [] }).write();

            return db;
        });
    }

    getAll = async () => {
        const dbContext = await this.dbContext;

        return dbContext
            .get(this.tableName)
            .value();
    }

    getById = async (attendanceId) => {
        const dbContext = await this.dbContext;

        return dbContext
            .get(this.tableName)
            .find({ 'attendanceId': attendanceId })
            .value();
    }

    getByEventId = async (eventId) => {
        const dbContext = await this.dbContext;

        console.log(dbContext
            .get(this.tableName).find(a => { a.eventId = eventId })
            .value());

        return dbContext
            .get(this.tableName)
            .find({ 'eventId': eventId })
            .value();
    }

    insertAttendance = async (attendance) => {
        const dbContext = await this.dbContext;
        const attendanceId = attendance.attendanceId || uuid();

        dbContext
            .get(this.tableName)
            .push({ attendanceId, ...attendance })
            .write();
    }

    updateAttendance = async (attendance) => {
        const dbContext = await this.dbContext;
        
        console.log(attendance);

        dbContext
            .get(this.tableName)
            .find({ 'attendanceId': attendance.attendanceId })
            .assign(attendance).write();
    }

    deleteAttendance = async (attendanceId) => {
        const dbContext = await this.dbContext;

        dbContext
            .get(this.tableName)
            .remove({ 'attendanceId': attendanceId }).write();
    }
}
