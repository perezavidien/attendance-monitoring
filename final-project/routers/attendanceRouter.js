import express from 'express'
import * as attendanceController from '../controllers/attendanceController.js';

const attendanceRouter = express.Router();

attendanceRouter.get('/', attendanceController.getAll);

attendanceRouter.get('/:id', attendanceController.getById);
//•	POST: /attendance/ 
attendanceRouter.post('/', attendanceController.create);
// PUT /attendance/
attendanceRouter.put('/', attendanceController.update);
//•	DELETE: /attendance/id
attendanceRouter.delete('/:id', attendanceController.deleteById);

export default attendanceRouter;