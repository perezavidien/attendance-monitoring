import EventDatastore from '../dataAccess/events/eventsDatastore.js';
import Validator from 'validatorjs';
import { ErrorHandler } from '../helpers/errorHandler.js'
import { hasMemberAttendance } from '../helpers/validators/eventsValidator.js'
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

        if (!eventData) {
            throw new ErrorHandler(404);
        }

        const attendanceDataStore = new AttendanceDatastore();
        const attendanceData = await attendanceDataStore.getByEventId(id);

        const memberAttendanceArr = [];
        if (attendanceData) {
            const memberDataStore = new MemberDatastore();

            // todo hindi array to
            //attendanceData.forEach(_a => {

            const { timeIn, timeOut } = attendanceData;
            const memberData = await memberDataStore.getByAttendanceId(attendanceData.attendanceId); //dapat array

            // todo hindi array to
            //memberData.forEach(_m => {

            if (memberData) {
                memberAttendanceArr.push({
                    "memberId": memberData.memberId,
                    "name": memberData.memberName,
                    "timeIn": timeIn,
                    "timeOut": timeOut
                });
            }
            //});
            //});
        }
        eventData.memberAttendance = memberAttendanceArr;

        //validate
        //Return Event object with array of MemberAttendance
        //  MemberAttendance:
        //     MemberId (GUID)
        //     Name
        //     TimeIn
        //     TimeOut

        if (!eventData) {
            throw new ErrorHandler(404);
        }

        res.send(eventData);

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
        const { eventname, datestart, dateend } = req.query;

        if (!eventname && !datestart && !dateend) {
            throw new ErrorHandler(400);
        }

        //todo
        //o	Date Format: yyyy_mm_dd 
        const data = await dataStore.getByNameAndDates(eventname, datestart, dateend);

        //validate?

        // Search events by Event Name, DateTime Start, DateTime End
        // Date Format: yyyy_mm_dd 
        // Will return an error if no search criteria provided

        if (!data) {
            throw new ErrorHandler(404);
        }

        res.send(data);

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
        const { eventId } = req.body;

        const exists = await dataStore.getById(eventId);

        //validate
        const validationRules = {
            //eventId: 'required',
            eventName: 'required|string',
            eventType: 'required|string',
            startDateTime: ['required', 'date', 'before:endDateTime'],
            endDateTime: ['required', 'date', 'after:startDateTime']
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
        const { eventId } = req.body;

        const exists = await dataStore.getById(eventId);

        //validate
        const validationRules = {
            eventId: 'required',
            eventName: 'required|string',
            eventType: 'required|string',
            startDateTime: ['required', 'date', 'before:endDateTime'],
            endDateTime: ['required', 'date', 'after:startDateTime']
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
        } else if (await hasMemberAttendance(id)) {
            throw new ErrorHandler(400);
        }

        //todo test
        //Return a validation error if there is a member attendance
        console.log('before delete');
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

        console.log(eventData);
        // validate
        if (!eventData)
            throw new ErrorHandler(404);

        const attendanceDataStore = new AttendanceDatastore();
        const attendanceData = await attendanceDataStore.getByEventId(eventId);

        console.log(attendanceData);

        let membersList = [];

        if (attendanceData) {
            const memberDataStore = new MemberDatastore();

            //attendanceData.forEach(_a => {
            // todo not array pa
            const memberData = await memberDataStore.getByAttendanceId(attendanceData.attendanceId);

            console.log(memberData);
            const { timeIn, timeOut } = attendanceData;

            if (memberData) {
                // todo not array pa
                //memberData.forEach(_m => {
                membersList.push({
                    "name": memberData.memberName,
                    "timeIn": timeIn,
                    "timeOut": timeOut
                });
                //});
            }
            //});

            console.log(membersList);
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

            const fileName = eventData.eventName + '_' + eventData.startDateTime + '.csv';
            // todo Sort results by Time-In, Asc
            downloadCsv(res, fileName, mapping, membersList);

            next()
        }
    }
    catch (err) {
        next(err)
    }
}