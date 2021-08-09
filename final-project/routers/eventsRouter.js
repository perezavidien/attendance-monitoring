import express from 'express'
import * as eventsController from '../controllers/eventsController.js';

const eventRouter = express.Router();
//•	GET: /events/
router.get('/events/', eventsController.getAll);
//•	GET: /events/id
router.get('events/:id', eventsController.getById);
//•	GET: /events/search?eventname=[searchEventName]&datestart=[searchDateStart]&dataend=[searchDateEnd]
router.get('/events/search', eventsController.search); //check docu
//•	GET: /events/export?eventId
router.get('/events/export', eventsController.exportById);
//•	POST: / events /
router.post('/events/', eventsController.create);
// PUT / events /
router.put('/events/', eventsController.update);
//•	DELETE: /events/id
router.delete('/events/:id', eventsController.deleteById);

export default eventRouter;