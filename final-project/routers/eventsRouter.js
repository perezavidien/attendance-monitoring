import express from 'express'
import * as eventsController from '../controllers/eventsController.js';

const eventRouter = express.Router();
//•	GET: /events/
eventRouter.get('/', eventsController.getAll);
//•	POST: / events /
eventRouter.post('/', eventsController.create);
// PUT / events /
eventRouter.put('/', eventsController.update);
//•	DELETE: /events/id
eventRouter.delete('/:id', eventsController.deleteById);
//•	GET: /events/id
eventRouter.get('/:id', eventsController.getById);

export default eventRouter;