const router = require('express').Router();
const ctrl = require('../controllers/vehiculoController');
const upload = require('../middlewares/upload');

router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', upload.single('imagen'), ctrl.crear);
router.put('/:id', upload.single('imagen'), ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

module.exports = router;
