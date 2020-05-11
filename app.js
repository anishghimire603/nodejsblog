const express = require("express")
const connectToDatabase = require("./Database/dbConfig")
const expressLayouts = require("express-ejs-layouts")
const passport = require("passport")
const flash = require("connect-flash")
const methodOverride = require('method-override')
const session = require("express-session")
const User = require("./Database/models/userModel")
const seedDB = require("./Database/models/seed")
//Routes
const articleRouter = require("./routes/articles")
const commentRouter = require("./routes/comments")
const checkAllRoutes = require("./middleware/allRoutes")
const Blog = require("./Database/models/blogModel")


const app = express();
connectToDatabase()
seedDB()


//Passport config
require("./config/passport")(passport)

app.use(express.static(__dirname + '/public'));


//EJS
app.use(expressLayouts);
app.set("view engine", 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride("_method"));

checkAllRoutes

//Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash())

//Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

app.use(express.urlencoded({ extended: false }))



//Article router
app.use('/articles', checkAllRoutes, articleRouter)
app.use('/articles', commentRouter)


//Restful Routes
app.get('/', async (req, res) => {
    const articles = await Blog.find().sort({ createdAt: 'desc' })
    res.render("articles/index", { articles: articles, currentUser: req.user })
})

app.use("/users", checkAllRoutes, require('./routes/users'))








const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Server listening on port 3000")
})