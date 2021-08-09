import express from 'express'
import * as membersController from '../controllers/membersController.js';

const memberRouter = express.Router();
//•	GET: /members/
router.get('/', membersController.getAll);
//•	GET: /members/Id
router.get('/:id', membersController.getById);
//•	GET: /members/search?name=&status=
router.get('/search', membersController.search); //check docu
//•	POST: / members /
router.post('/', membersController.create);
// PUT / members /
router.put('/', membersController.update);
//•	DELETE: /members/Id
router.delete('/member/:id', membersController.deleteById);

export default memberRouter;