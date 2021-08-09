import Datastore from '../dataAccess/events/eventsDatastore';
import Validator from 'validatorjs';
import { ErrorHandler } from '../helpers/errorHandler.js'
import { recordsExists, hasMemberAttendance, displayResponse } from '../helpers/validators/eventsValidator'

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
        //Return Event object with array of MemberAttendance
        //  MemberAttendance:
        //     MemberId (GUID)
        //     Name
        //     TimeIn
        //     TimeOut

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


        const data = await dataStore.getByNameAndDates(name, status);
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
        const dataStore = new Datastore();
        const { id } = req.body;

        // const data = await dataStore
        //     .getById(id);

        //validate
        // Accept Event object
        // Event start date should be < event end date
        // Required fields validation check

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
        const dataStore = new Datastore();
        const { id } = req.params;

        // const data = await dataStore
        //     .getById(id);

        //validate
        // Accept Event object
        // Event start date should be < event end date
        // Required fields validation check


        await dataStore
            .updateEvent(dataname, req.body);

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
        //Return a validation error if there is a member attendance

        await dataStore
            .deleteEvent(id);

        res.sendStatus(200);

        next()
    }
    catch (err) {
        next(err)
    }
}

export const exportById = async (req, res, next) => {
    try {
        const dataStore = new Datastore()
        const { id } = req.params;

        const data = await dataStore.getById('id', id);
        // validate
        // displayResponse(res, data);
        // return excel file
        //Filename: [EventName]_[EventStartDateTime].xlsx
        //Columns:
        // •	Member Name
        // •	Time-In
        // •	Time-Out
        // Sort results by Time-In, Asc

        next()
    }
    catch (err) {
        next(err)
    }
}