import Datastore from '../dataAccess/members/membersDatastore.js';
import Validator from 'validatorjs';
import { ErrorHandler } from '../helpers/errorHandler.js'
import { recordsExists, hasEventAttendance, displayResponse } from '../helpers/validators/membersValidator.js'

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

        const data = await dataStore.getById('Id', id);
        //validate

        // Return Member object with array of EventAttendance
        //    EventAttendance
        //      EventName
        //      TimeIn
        //      TimeOut

        displayResponse(res, data);

        next()
    }
    catch (err) {
        next(err)
    }
}


export const search = async (req, res, next) => {
    try {
        const dataStore = new Datastore();
        const { name, status } = req.params;
        console.log(req.params);
        debugger;


        const data = await dataStore.getByNameAndStatus(name, status);
        //validate
        // Status are enumerations of
        // 	Active
        // 	In-active

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
        //o	Required fields validation check

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
        const dataStore = new Datastore();
        const { id } = req.params;

        // const data = await dataStore
        //     .getById(id);

        //validate
        //o	Required fields validation check

        await dataStore
            .updateMember(dataname, req.body);

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

        const data = await dataStore
            .getById(id);

        //validate
        //o	Return a validation error if there is an event attendance

        await dataStore
            .deleteMember(id);

        res.sendStatus(200);

        next()
    }
    catch (err) {
        next(err)
    }
}