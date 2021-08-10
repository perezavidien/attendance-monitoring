import lowdb from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';

const moduleURL = path.dirname(fileURLToPath(import.meta.url));
const dbAsync = lowdb(new FileAsync(path.join(moduleURL, 'attendanceDb.json')));

export default class Datastore {
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

    getById = async (id) => {
        const dbContext = await this.dbContext;

        return dbContext
            .get(this.tableName)
            .find({ 'id': id })
            .value();
    }

    insertAttendance = async (attendance) => {
        const dbContext = await this.dbContext;
        const id = uuid();

        dbContext
            .get(this.tableName)
            .push({ id, ...attendance })
            .write();
    }

    updateAttendance = async (attendance) => {
        const dbContext = await this.dbContext;

        dbContext
            .get(this.tableName)
            .find({ 'id': attendance.id })
            .assign(attendance).write();
    }

    deleteAttendance = async (id) => {
        const dbContext = await this.dbContext;

        dbContext
            .get(this.tableName)
            .remove({ 'id': id }).write();
    }
}
