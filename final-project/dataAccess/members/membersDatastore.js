import lowdb from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';

const moduleURL = path.dirname(fileURLToPath(import.meta.url));
const dbAsync = lowdb(new FileAsync(path.join(moduleURL, 'membersDb.json')));

export default class MemberDatastore {
    constructor() {
        this.tableName = 'members';
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

    getById = async (memberId) => {
        const dbContext = await this.dbContext;
        return dbContext
            .get(this.tableName)
            .find({ 'memberId': memberId })
            .value();
    }

    getByAttendanceId = async (attendanceId) => {
        const dbContext = await this.dbContext;
        return dbContext
            .get(this.tableName)
            .find({ 'attendanceId': attendanceId })
            .value();
    }

    getByNameAndStatus = async (name, status) => {
        const dbContext = await this.dbContext;

        //todo
        // this search is case sensitive and the datets are treated as strings
        return dbContext
            .get(this.tableName)
            .find({ 'memberName': name, 'status': status })
            .value();
    }

    insertMember = async (member) => {
        const dbContext = await this.dbContext;
        const memberId = uuid();
        dbContext
            .get(this.tableName)
            .push({ memberId, ...member })
            .write();
    }

    updateMember = async (member) => {
        const dbContext = await this.dbContext;
        dbContext
            .get(this.tableName)
            .find({ 'memberId': member.memberId })
            .assign(member).write();
    }

    deleteMember = async (memberId) => {
        const dbContext = await this.dbContext;
        dbContext
            .get(this.tableName)
            .remove({ 'memberId': memberId }).write();
    }
}
