import express from 'express'
import * as eventsController from '../controllers/eventsController.js';

const eventRouter = express.Router();
//•	GET: /events/
router.get('/', eventsController.getAll);
//•	GET: /events/id
router.get('/:id', eventsController.getById);
//•	GET: /events/search?eventname=[searchEventName]&datestart=[searchDateStart]&dataend=[searchDateEnd]
router.get('/search', eventsController.search); //check docu
//•	GET: /events/export?eventId
router.get('/export', eventsController.exportById);
//•	POST: / events /
router.post('/', eventsController.create);
// PUT / events /
router.put('/', eventsController.update);
//•	DELETE: /events/id
router.delete('/:id', eventsController.deleteById);

export default eventRouter;