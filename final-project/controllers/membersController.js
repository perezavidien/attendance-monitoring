import MemberDatastore from '../dataAccess/members/membersDatastore.js';
import AttendanceDatastore from '../dataAccess/attendance/attendanceDatastore.js';
import EventDatastore from '../dataAccess/events/eventsDatastore.js';
import Validator from 'validatorjs';
import { ErrorHandler } from '../helpers/errorHandler.js'
import { hasEventAttendance } from '../helpers/validators/membersValidator.js'

export const getAll = async (req, res, next) => {
    try {
        console.log('getAll');
        const dataStore = new MemberDatastore()
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

        if (id === 'search') {
            return search(req, res, next);
        }
        const memberDataStore = new MemberDatastore();
        const memberData = await memberDataStore.getById(id);

        if (!memberData) {
            throw new ErrorHandler(404);
        }

        //if has attendance
        const eventAttendanceArr = [];
        console.log(memberData.attendanceId);

        if (memberData.attendanceId) {
            const attendanceDatastore = new AttendanceDatastore();
            // todo hindi sya array :(
            const attendanceData = await attendanceDatastore.getById(memberData.attendanceId);

            console.log(attendanceData);
            //attendanceData.forEach(a => {

            if (attendanceData) {
                const eventDatastore = new EventDatastore();
                const eventData = await eventDatastore.getById(attendanceData.eventId);


                const { timeIn, timeOut } = attendanceData;
                const eventName = eventData?.eventName;

                eventAttendanceArr.push({
                    "eventName": eventName,
                    "timeIn": timeIn,
                    "timeOut": timeOut,
                });
            }
            //});
        }

        memberData.eventAttendance = eventAttendanceArr;
        res.send(memberData);

        next()
    }
    catch (err) {
        next(err)
    }
}

// GET: /members/search?name=&status=
export const search = async (req, res, next) => {
    try {
        console.log('search');
        const dataStore = new MemberDatastore();

        const name = req.query?.name;
        const status = req.query?.status;

        const data = await dataStore.getByNameAndStatus(name, status);

        //todo
        // Status are enumerations of
        // 	Active
        // 	In-active

        if (!data) {
            throw new ErrorHandler(404)
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
        const dataStore = new MemberDatastore();
        const { memberId } = req.body;

        //validate
        const validationRules = {
            // memberId: 'required', // creating should accept no Id?
            memberName: 'required|string',
            joinedDate: 'date',
            status: 'required|string'
        };

        // Required fields validation check
        // Status should be Active / Inactive

        const validation = new Validator(req.body, validationRules);

        //try to get if the data already exists
        const data = await dataStore.getById(memberId);

        if (data) {
            throw new ErrorHandler(409);
        }
        else if (validation.fails()) {
            throw new ErrorHandler(400);
        }

        await dataStore
            .insertMember(req.body);

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
        const dataStore = new MemberDatastore();
        const { memberId } = req.body;

        //validate
        const validationRules = {
            memberId: 'required',
            memberName: 'required|string',
            joinedDate: 'date',
            status: 'required|string'
        };
        // Required fields validation check
        // Status should be Active / Inactive

        const validation = new Validator(req.body, validationRules);
        const data = await dataStore.getById(memberId);

        if (!data) {
            throw new ErrorHandler(404);
        }
        else if (validation.fails()) {
            throw new ErrorHandler(400);
        }

        await dataStore
            .updateMember(req.body);

        res.sendStatus(200);

        next()
    }
    catch (err) {
        next(err)
    }
}

export const deleteById = async (req, res, next) => {
    try {
        console.log('delete');
        const dataStore = new MemberDatastore();
        const { id } = req.params;

        const data = await dataStore.getById(id);

        if (!data) {
            throw new ErrorHandler(404);
        } else if (hasEventAttendance(data)) {
            throw new ErrorHandler(400);
        }

        //validate
        //TODO
        //Return a validation error if there is an event attendance

        await dataStore
            .deleteMember(id);

        res.sendStatus(200);

        next()
    }
    catch (err) {
        next(err)
    }
}