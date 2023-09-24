const express = require('express');
const router = express.Router();

// Imported individual route files
const usersRouter = require('./users/users.routes');
// const adminRouter = require('./admin/admin');
// const shopsRouter = require('./shops/shopOwner');
// const ridersRouter = require('./riders/rider');

// Used the individual route files
router.use('/users', usersRouter);
// router.use('/admin', adminRouter);
// router.use('/shops', shopsRouter);
// router.use('/riders', ridersRouter);

module.exports = router;
