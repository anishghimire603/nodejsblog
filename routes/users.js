const router = require("express").Router();
const User = require("../Database/models/userModel")
const bcrypt = require("bcrypt")
const passport = require("passport")





//Login Page
router.get("/login", (req, res) => res.render("login"));

//Register Page
router.get("/register", (req, res) => res.render('register'));


//Register handel
router.post("/register", (req, res) => {
    const { name, email, password, password2 } = req.body
    let errors = [];

    //check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all the fields!' })
    }

    //check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    //check pass length
    if (password.length < 6) {
        errors.push({ msg: "Password should be at least 6 characters!" })
    }

    if (errors.length > 0) {
        res.render("register", {
            errors,
            name,
            email
        })
    } else {
        //Validation Pass
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    //User exists
                    errors.push({ msg: "Email Already Exists!" })
                    res.render("register", {
                        errors,
                        name,
                        email
                    })
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    //hash password
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) throw err;
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            //set password to hash password
                            newUser.password = hash;
                            //save user to database
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', "You are now registered and can login")
                                    res.redirect("/users/login")
                                })
                                .catch(err => console.log(err))

                        })
                    })
                }
            })

    }
})


// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout handel
router.get("/logout", (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out')
    res.redirect("/users/login")
})






module.exports = router