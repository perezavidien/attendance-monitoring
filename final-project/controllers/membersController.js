import Datastore from '../dataAccess/members/membersDatastore.js';
import Validator from 'validatorjs';
import { ErrorHandler } from '../helpers/errorHandler.js'
import { displayResponse, hasEventAttendance, recordsExists } from '../helpers/validators/membersValidator.js'

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

// GET: /members/search?name=&status=
export const search = async (req, res, next) => {
    try {
        const dataStore = new Datastore();

        const name = req.query?.name;
        const status = req.query?.status;

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

        const data = await dataStore.getById(id);

        //validate
        const validationRules = {
            id: 'required',
            name: 'required|string',
            joinedDate: 'date',
            status: 'required'
        };
        // Required fields validation check
        // Status should be Active / Inactive

        const validation = new Validator(req.body, validationRules);

        if (recordExists(data.id)) {
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
        const dataStore = new Datastore();
        const { id } = req.params;

        const data = await dataStore.getById(id);

        //validate
        const validationRules = {
            id: 'required',
            name: 'required|string',
            joinedDate: 'date',
            status: 'required'
        };
        // Required fields validation check
        // Status should be Active / Inactive

        const validation = new Validator(req.body, validationRules);

        if (!recordExists(data)) {
            throw new ErrorHandler(404);
        }
        else if (validation.fails()) {
            throw new ErrorHandler(400);
        }

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

        const data = await dataStore.getById(id);

        if (!recordExists(data)) {
            throw new ErrorHandler(404);
        } else if (hasEventAttendance(data)) {
            throw new ErrorHandler(400);
        }

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