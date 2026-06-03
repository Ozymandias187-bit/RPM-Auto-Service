const router = require('express').Router();
const ctrl = require('../controllers/ventaController');
const upload = require('../middlewares/upload');

router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', upload.single('contrato'), ctrl.crear);
router.put('/:id', upload.single('contrato'), ctrl.actualizar);

module.exports = router;
