import Datastore from '../dataAccess/attendance/attendanceDatastore.js';
import Validator from 'validatorjs';
import { ErrorHandler } from '../helpers/errorHandler.js'
import { recordExists, displayResponse } from '../helpers/validators/attendanceValidator.js'

export const getAll = async (req, res, next) => {
    try {
        console.log('getall');
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
        console.log('create');
        const dataStore = new Datastore();
        const { id, timeIn, timeOut } = req.body;

        const exists = await dataStore.getById(id);


        //validate
        const validationRules = {
            id: 'required',
            timeIn: ['required', 'date'], //, 'before:timeOut'], //todo: this validator makes them both required
            timeOut: ['date'] //, 'after:timeIn']
        };
        // Time-in date should be < Time-out date
        // Required fields validation check

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
        const dataStore = new Datastore();
        const { id, timeIn, timeOut } = req.body;

        const exists = await dataStore.getById(id);


        //validate
        const validationRules = {
            id: 'required', //todo uuid
            timeIn: ['required', 'date'], //, 'before:timeOut'],
            timeOut: ['date'] //, 'after:timeIn']
        };

        const validation = new Validator(req.body, validationRules);

        if (!exists) {
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
        console.log('delete');
        const dataStore = new Datastore();
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