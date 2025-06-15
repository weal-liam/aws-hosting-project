const express = require('express');
const { homepage, services, contacts, aboutUs, welcome, remarks, comments } = require('./controllers');
//const { registerController, loginController, profileController,protectedController} = require('../controllers/userControllers');
//const auth = require('../middleware/auth');

const router = express.Router();

// Public routes
//router.post('/register', registerController);
//router.post('/login', loginController);
//router.post('/createprofile', profileController);
// Protected routes

router.get('/',(req,res)=>{
    res.status(200).render("t1",{})
})

router.get('/welcome',welcome)

router.get('/remarks',remarks)

router.get('/home',homepage)

router.get('/services',services)

router.get('/contacts', contacts)

router.get('/about-us', aboutUs)

router.get('/comments',comments)


module.exports = router;