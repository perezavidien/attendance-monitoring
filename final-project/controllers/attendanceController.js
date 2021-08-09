import Datastore from '../dataAccess/attendance/attendanceDatastore.js';
import Validator from 'validatorjs';
import { ErrorHandler } from '../helpers/errorHandler.js'
import { recordsExists, displayResponse } from '../helpers/validators/attendanceValidator.js'

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

        const data = await dataStore.getById('id', id);
        //validate
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
        const { id } = req.body;

        // const data = await dataStore
        //     .getById(id);

        //validate
        // Time-in date should be < Time-out date
        // Required fields validation check

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
        const { id } = req.params;

        // const data = await dataStore
        //     .getById(id);

        //validate
        // Time-in date should be < Time-out date
        // Required fields validation check

        await dataStore
            .updateAttendance(dataname, req.body);

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

        await dataStore
            .deleteAttendance(id);

        // delete eventattendance? and memberattendance?

        res.sendStatus(200);

        next()
    }
    catch (err) {
        next(err)
    }
}