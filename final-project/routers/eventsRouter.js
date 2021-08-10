import express from 'express'
import * as eventsController from '../controllers/eventsController.js';

const eventRouter = express.Router();
//•	GET: /events/
eventRouter.get('/', eventsController.getAll);
//•	GET: /events/id
eventRouter.get('/:id', eventsController.getById);
//•	GET: /events/search?eventname=[searchEventName]&datestart=[searchDateStart]&dataend=[searchDateEnd]
eventRouter.get('/search', eventsController.search); //check docu
//•	GET: /events/export?eventId
eventRouter.get('/export', eventsController.exportById);
//•	POST: / events /
eventRouter.post('/', eventsController.create);
// PUT / events /
eventRouter.put('/', eventsController.update);
//•	DELETE: /events/id
eventRouter.delete('/:id', eventsController.deleteById);

export default eventRouter;