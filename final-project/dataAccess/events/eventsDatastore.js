import lowdb from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';

const moduleURL = path.dirname(fileURLToPath(import.meta.url));
const dbAsync = lowdb(new FileAsync(path.join(moduleURL, 'eventsDb.json')));

export default class EventDatastore {
    constructor() {
        this.tableName = 'events';
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

    getById = async (eventId) => {
        const dbContext = await this.dbContext;

        return dbContext
            .get(this.tableName)
            .find({ 'eventId': eventId })
            .value();
    }

    getByNameAndDates = async (eventName, startDateTime, endDateTime) => {
        const dbContext = await this.dbContext;

        //todo
        // this search is case sensitive and the datets are treated as strings
        return dbContext
            .get(this.tableName)
            .find(e => {
                return e.eventName.toLowerCase() === eventName.toLowerCase()
                    && e.startDateTime === startDateTime
                    && e.endDateTime === endDateTime
            })
            .value();
    }

    insertEvent = async (event) => {
        const dbContext = await this.dbContext;
        const eventId = event.eventId || uuid();

        dbContext
            .get(this.tableName)
            .push({ eventId, ...event })
            .write();
    }

    updateEvent = async (event) => {
        const dbContext = await this.dbContext;

        dbContext
            .get(this.tableName)
            .find({ 'eventId': event.eventId })
            .assign(event).write();
    }

    deleteEvent = async (eventId) => {
        const dbContext = await this.dbContext;

        dbContext
            .get(this.tableName)
            .remove({ 'eventId': eventId }).write();
    }
}
