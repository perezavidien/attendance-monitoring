import Datastore from '../dataAccess/members/membersDatastore.js';
import Validator from 'validatorjs';
import { ErrorHandler } from '../helpers/errorHandler.js'
import { displayResponse, hasEventAttendance, recordExists } from '../helpers/validators/membersValidator.js'

export const getAll = async (req, res, next) => {
    try {
        console.log('getAll');
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

        if (id === 'search') {
            search(req, res, next);
        } else {
            const dataStore = new Datastore()
            const data = await dataStore.getById(id);

            // Return Member object with array of EventAttendance
            //    EventAttendance
            //      EventName
            //      TimeIn
            //      TimeOut

            displayResponse(res, data);

            next()
        }
    }
    catch (err) {
        next(err)
    }
}

// GET: /members/search?name=&status=
export const search = async (req, res, next) => {
    try {
        console.log('search');
        const dataStore = new Datastore();

        const name = req.query?.name;
        const status = req.query?.status;

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
        console.log('create');
        const dataStore = new Datastore();
        const { id } = req.body;

        //validate
        const validationRules = {
            id: 'required',
            name: 'required|string',
            joinedDate: 'date',
            status: 'required|string'
        };

        // Required fields validation check
        // Status should be Active / Inactive

        const validation = new Validator(req.body, validationRules);

        //try to get if the data already exists
        const data = await dataStore.getById(id);

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
        const dataStore = new Datastore();
        const { id } = req.body;

        //validate
        const validationRules = {
            id: 'required',
            name: 'required|string',
            joinedDate: 'date',
            status: 'required|string'
        };
        // Required fields validation check
        // Status should be Active / Inactive

        const validation = new Validator(req.body, validationRules);
        const data = await dataStore.getById(id);

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
        const dataStore = new Datastore();
        const { id } = req.params;

        const data = await dataStore.getById(id);

        if (!data) {
            throw new ErrorHandler(404);
        } else if (hasEventAttendance(data)) {
            throw new ErrorHandler(400); //to test
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