import express from 'express'
import * as attendanceController from '../controllers/attendanceController.js';

const attendanceRouter = express.Router();

router.get('/', attendanceController.getAll);

router.get('/:id', attendanceController.getById);
//•	POST: /attendance/ 
router.post('/', attendanceController.create);
// PUT /attendance/
router.put('/', attendanceController.update);
//•	DELETE: /attendance/id
router.delete('/attendance/:id', attendanceController.deleteById);

export default attendanceRouter;