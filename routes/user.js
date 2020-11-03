const { Router } = require("express");
const express = require("express");
const { protect, authorize } = require('../middleware/auth')

const {
    getAllUser,
    getUser,
    updateUser,
    createUser,
    deleteUser
} = require('../controllers/user');

const user = require('../models/user');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({
    mergeParams: true
});

router.route('/').get(protect, authorize('publisher', 'admin'), getAllUser);
router.route('/:id').get(protect, authorize('publisher', 'admin'), getUser);
router.route('/:id').put(protect, authorize('publisher', 'admin'), updateUser);
router.route('/').post(protect, authorize('publisher', 'admin'), createUser);
router.route('/:id').delete(protect, authorize('publisher', 'admin'), deleteUser);

module.exports = router; 