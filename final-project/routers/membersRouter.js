import express from 'express'
import * as membersController from '../controllers/membersController.js';

const memberRouter = express.Router();
//•	GET: /members/
memberRouter.get('/', membersController.getAll);
//•	POST: / members /
memberRouter.post('/', membersController.create);
// PUT / members /
memberRouter.put('/', membersController.update);
//•	GET: /members/Id
memberRouter.get('/:id', membersController.getById);
//•	DELETE: /members/Id
memberRouter.delete('/:id', membersController.deleteById);

export default memberRouter;