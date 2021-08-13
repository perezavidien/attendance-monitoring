import Datastore from '../dataAccess/events/eventsDatastore.js';
import Validator from 'validatorjs';
import { ErrorHandler } from '../helpers/errorHandler.js'
import { recordExists, hasMemberAttendance, displayResponse } from '../helpers/validators/eventsValidator.js'
import { downloadCsv } from '../helpers/downloadCsv.js';

export const getAll = async (req, res, next) => {
    try {
        const dataStore = new Datastore()
        const data = await dataStore.getAll();

        res.send(data);

        next()
    }
    catch (err) {
        next(err)
    }
}

export const getById = async (req, res, next) => {
    try {
        console.log('getbyid');
        const { id } = req.params;

        if (id === "search") {
            search(req, res, next);
        } else if (id === "export") {
            exportById(req, res, next);
        } else {
            const dataStore = new Datastore()
            const data = await dataStore.getById(id);

            //validate
            //Return Event object with array of MemberAttendance
            //  MemberAttendance:
            //     MemberId (GUID)
            //     Name
            //     TimeIn
            //     TimeOut

            displayResponse(res, data);

            next()
        }
    }
    catch (err) {
        next(err)
    }
}

// GET: /events/search?eventname=[searchEventName]&datestart=[searchDateStart]&dataend=[searchDateEnd]
export const search = async (req, res, next) => {
    try {
        console.log('search');
        const dataStore = new Datastore();
        const { name, datestart, dateend } = req.query;

        const data = await dataStore.getByNameAndDates(name, datestart, dateend);
        //validate?

        // Search events by Event Name, DateTime Start, DateTime End
        // Date Format: yyyy_mm_dd 
        // Will return an error if no search criteria provided

        displayResponse(res, data);

        next()
    }
    catch (err) {
        next(err)
    }
}

export const create = async (req, res, next) => {
    try {
        console.log('create');
        const dataStore = new Datastore();
        const { id } = req.body;

        const exists = await dataStore.getById(id);

        //validate
        const validationRules = {
            id: 'required',
            name: 'required|string',
            type: 'required|string',
            startTime: ['required', 'date', 'before:endTime'],
            endTime: ['required', 'date', 'after:startTime']
        };
        // Accept Event object
        // Event start date should be < event end date
        // Required fields validation check

        const validation = new Validator(req.body, validationRules);

        if (exists) {
            throw new ErrorHandler(409);
        }
        else if (validation.fails()) {
            throw new ErrorHandler(400);
        }

        await dataStore
            .insertEvent(req.body);

        res.sendStatus(201);

        next()
    }
    catch (err) {
        next(err)
    }
}

export const update = async (req, res, next) => {
    try {
        console.log('update');
        const dataStore = new Datastore();
        const { id } = req.body;

        const exists = await dataStore.getById(id);

        //validate
        const validationRules = {
            id: 'required',
            name: 'required|string',
            type: 'required|string',
            startTime: ['required', 'date', 'before:endTime'],
            endTime: ['required', 'date', 'after:startTime']
        };
        // Accept Event object
        // Event start date should be < event end date
        // Required fields validation check

        const validation = new Validator(req.body, validationRules);

        if (!exists) {
            throw new ErrorHandler(404);
        }
        else if (validation.fails()) {
            throw new ErrorHandler(400);
        }

        await dataStore
            .updateEvent(req.body);

        res.sendStatus(200);

        next()
    }
    catch (err) {
        next(err)
    }
}

export const deleteById = async (req, res, next) => {
    try {
        console.log('deletebyid');
        const dataStore = new Datastore();
        const { id } = req.params;

        const exists = await dataStore.getById(id);

        //validate
        if (!exists) {
            throw new ErrorHandler(404);
        } else if (hasMemberAttendance(exists)) {
            throw new ErrorHandler(400);
        }
        //todo 
        //Return a validation error if there is a member attendance

        await dataStore.deleteEvent(id);

        res.sendStatus(200);

        next()
    }
    catch (err) {
        next(err)
    }
}

// GET: /events/export?eventId
export const exportById = async (req, res, next) => {
    try {
        console.log('exportbyid');
        const eventId = req._parsedUrl.query;
        const dataStore = new Datastore();
        const data = await dataStore.getById(eventId);

        // validate
        if (!data)
            throw new ErrorHandler(404);

        //todo
        // displayResponse(res, data);
        // return excel file
        //Filename: [EventName]_[EventStartDateTime].xlsx
        //Columns:
        // •	Member Name
        // •	Time-In
        // •	Time-Out
        // Sort results by Time-In, Asc
        const mapping = [
            {
                label: 'Event Id',
                value: 'id'
            }, {
                label: 'Event Name',
                value: 'name'
            }, {
                label: 'Event Type',
                value: 'type'
            }, {
                label: 'Start Date',
                value: 'startDate'
            }, {
                label: 'End Date',
                value: 'endDate'
            }, {
                label: 'Member Attendance',
                value: 'memberAttendance'
            }
        ];

        console.log(mapping);
        const fileName = data.name + '_' + data.startTime + '.csv';
        downloadCsv(res, fileName, mapping, data);

        next()
    }
    catch (err) {
        next(err)
    }
}