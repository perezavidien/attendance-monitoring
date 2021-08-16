import EventDatastore from '../dataAccess/events/eventsDatastore.js';
import Validator from 'validatorjs';
import { ErrorHandler } from '../helpers/errorHandler.js'
import { recordExists, hasMemberAttendance, displayResponse } from '../helpers/validators/eventsValidator.js'
import { downloadCsv } from '../helpers/downloadCsv.js';
import AttendanceDatastore from '../dataAccess/attendance/attendanceDatastore.js';
import MemberDatastore from '../dataAccess/members/membersDatastore.js';

export const getAll = async (req, res, next) => {
    try {
        const dataStore = new EventDatastore()
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
            return search(req, res, next);
        } else if (id === "export") {
            return exportById(req, res, next);
        }

        const eventDataStore = new EventDatastore();
        const eventData = await eventDataStore.getById(id);

        const attendanceDataStore = new AttendanceDatastore();
        const attendanceData = await attendanceDataStore.getByEventId(id);

        if (attendanceData) {
            const memberDataStore = new MemberDatastore();

            attendanceData.forEach(_ => {
                const memberData = await memberDataStore.getByAttendanceId(_.id);

                if (memberData)
                    _.push(memberData);
            });
            eventData.memberAttendance = attendanceData;
        } else {
            eventData.memberAttendance = [];
        }

        //validate
        //Return Event object with array of MemberAttendance
        //  MemberAttendance:
        //     MemberId (GUID)
        //     Name
        //     TimeIn
        //     TimeOut

        displayResponse(res, eventData);

        next()
    }
    catch (err) {
        next(err)
    }
}

// GET: /events/search?eventname=[searchEventName]&datestart=[searchDateStart]&dataend=[searchDateEnd]
export const search = async (req, res, next) => {
    try {
        console.log('search');
        const dataStore = new EventDatastore();
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
        const dataStore = new EventDatastore();
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
        const dataStore = new EventDatastore();
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
        const dataStore = new EventDatastore();
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
        const eventDataStore = new EventDatastore();
        const eventData = await eventDataStore.getById(eventId);

        // validate
        if (!eventData)
            throw new ErrorHandler(404);

        const attendanceDataStore = new AttendanceDatastore();
        const attendanceData = await attendanceDataStore.getByEventId(eventId);

        let membersList;

        if (attendanceData) {
            const memberDataStore = new MemberDatastore();

            attendanceData.forEach(_ => {
                const memberData = await memberDataStore.getByAttendanceId(_.id);

                const { timeIn, timeOut } = _;

                memberData.forEach(_m => {
                    membersList.push({
                        "name": _m.name,
                        "timeIn": timeIn,
                        "timeOut": timeOut
                    });
                });
            });

            //todo test 
            const mapping = [
                {
                    label: 'Member Name',
                    value: 'name'
                }, {
                    label: 'Time In',
                    value: 'timeIn'
                }, {
                    label: 'Time Out',
                    value: 'timeOut'
                }
            ];

            console.log(mapping);
            const fileName = eventData.name + '_' + eventData.startTime + '.xlsx';
            // Sort results by Time-In, Asc
            downloadCsv(res, fileName, mapping, membersList);

            next()
        }
    }
    catch (err) {
        next(err)
    }
}