const router = require("express").Router();

const Blog = require("../Database/models/blogModel")

const { ensureAuthenticated } = require('../config/auth');


//currentUser Middleware
router.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next()
})
router.get("/new", ensureAuthenticated, (req, res) => {
    res.render("articles/new", { article: new Blog() })
})

router.get("/edit/:id", checkBlogOwnerShip, async (req, res) => {

    Blog.findById(req.params.id, (err, article) => {
        res.render("articles/edit", { article: article })
    })


})

router.get("/:slug", async (req, res) => {
    await Blog.findOne({ slug: req.params.slug }).populate('comments').exec((err, article) => {
        if (err) {
            console.log(err)
        }
        if (article == null) res.redirect("/")
        res.render("articles/show", { article: article })
    })

})
router.post("/", async (req, res, next) => {
    req.article = new Blog()
    next()
}, saveArticleAndRedirect("new"))

router.put("/:id", checkBlogOwnerShip, ensureAuthenticated, async (req, res, next) => {
    req.article = await Blog.findById(req.params.id)
    next()
}, saveArticleAndRedirect("edit"))

router.delete("/:id", checkBlogOwnerShip, ensureAuthenticated, async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id)
    res.redirect("/")
})


function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article

        //capitalize the first letter of user
        username = req.user.name
        capital = username.charAt(0).toUpperCase() + username.slice(1)
        article.author = {
            username: capital,
            id: req.user._id,
            email: req.user.email
        }
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown


        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        } catch (err) {
            console.log(err)
            res.render(`articles/${path}`, { article: article })
        }

    }
}

function checkBlogOwnerShip(req, res, next) {

    if (req.isAuthenticated()) {

        Blog.findById(req.params.id, (err, article) => {
            if (err) {
                res.redirect("back")
            } else {
                //does the user own the blog
                if (article.author.id.equals(req.user._id)) {
                    next()

                } else {
                    res.redirect("back")
                }
            }
        })

    } else {
        req.flash()
        res.redirect("back")
    }

}
module.exports = router