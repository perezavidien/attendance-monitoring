import AttendanceDatastore from '../dataAccess/attendance/attendanceDatastore.js';
import Validator from 'validatorjs';
import { ErrorHandler } from '../helpers/errorHandler.js'

export const getAll = async (req, res, next) => {
    try {
        console.log('getall');
        const dataStore = new AttendanceDatastore()
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
        const dataStore = new AttendanceDatastore()
        const { id } = req.params;

        console.log(id);
        const data = await dataStore.getById(id);

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
        const dataStore = new AttendanceDatastore();
        const { attendanceId } = req.body;

        const exists = await dataStore.getById(attendanceId);


        //validate
        // Time-in date should be < Time-out date
        // Required fields validation check
        const validationRules = {
            //attendanceId: 'required',
            timeIn: ['required', 'date'], //, 'before:timeOut'], //todo: this 
            timeOut: ['date'] //, 'after:timeIn']
        };

        //apply the :after validator only if there is a value
        //:after validator makes them both required
        if (req.body.timeOut) {
            validationRules.timeIn.push('before:timeOut');
            validationRules.timeOut.push('after:timeIn');
        }

        const validation = new Validator(req.body, validationRules);

        if (exists) {
            throw new ErrorHandler(409);
        }
        else if (validation.fails()) {
            throw new ErrorHandler(400);
        }

        await dataStore
            .insertAttendance(req.body);

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
        const dataStore = new AttendanceDatastore();
        const { attendanceId } = req.body;

        const exists = await dataStore.getById(attendanceId);

        //validate
        // Time-in date should be < Time-out date
        // Required fields validation check

        const validationRules = {
            attendanceId: 'required', //todo uuid
            timeIn: ['required', 'date'],
            timeOut: ['date']
        };

        if (req.body.timeOut) {
            validationRules.timeIn.push('before:timeOut');
            validationRules.timeOut.push('after:timeIn');
        }

        const validation = new Validator(req.body, validationRules);

        if (!exists) {
            throw new ErrorHandler(404);
        }
        else if (validation.fails()) {
            throw new ErrorHandler(400);
        }

        console.log(req.body);
        await dataStore
            .updateAttendance(req.body);

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
        const dataStore = new AttendanceDatastore();
        const { id } = req.params;

        const exists = await dataStore.getById(id);

        if (!exists) {
            throw new ErrorHandler(404);
        }

        //todo
        // delete eventattendance? and memberattendance?

        await dataStore.deleteAttendance(id);

        res.sendStatus(200);

        next()
    }
    catch (err) {
        next(err)
    }
}