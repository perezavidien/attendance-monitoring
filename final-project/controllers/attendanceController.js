import Datastore from '../dataAccess/attendance/attendanceDatastore.js';
import Validator from 'validatorjs';
import { ErrorHandler } from '../helpers/errorHandler.js'
import { recordExists, displayResponse } from '../helpers/validators/attendanceValidator.js'

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
        const dataStore = new Datastore()
        const { id } = req.params;

        const data = await dataStore.getById(id);

        displayResponse(res, data);

        next()
    }
    catch (err) {
        next(err)
    }
}

export const create = async (req, res, next) => {
    try {
        const dataStore = new Datastore();
        const { id, timeIn, timeOut } = req.body;

        const data = await dataStore.getById(id);


        //validate
        const validationRules = {
            id: 'required',
            timeIn: ['required', 'date', 'before:timeOut'],
            timeOut: ['date', 'after:timeIn']
        };
        // Time-in date should be < Time-out date
        // Required fields validation check

        const validation = new Validator(req.body, validationRules);

        if (recordExists(data.id)) {
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
        const dataStore = new Datastore();
        const { id, timeIn, timeOut } = req.body;

        const data = await dataStore.getById(id);


        //validate
        const validationRules = {
            id: 'required',
            timeIn: ['required', 'date', 'before:timeOut'],
            timeOut: ['date', 'after:timeIn']
        };

        const validation = new Validator(req.body, validationRules);

        if (!recordExists(data)) {
            throw new ErrorHandler(404);
        }
        else if (validation.fails()) {
            throw new ErrorHandler(400);
        }
        // Time-in date should be < Time-out date
        // Required fields validation check

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
        const dataStore = new Datastore();
        const { id } = req.params;

        const data = await dataStore.getById(id);

        if (!recordExists(data)) {
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