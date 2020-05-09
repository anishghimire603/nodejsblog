const router = require("express").Router();
const Blog = require("../Database/models/blogModel")
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');



router.get("/new", ensureAuthenticated, (req, res) => {
    res.render("articles/new", { article: new Blog() })
})

router.get("/edit/:id", async (req, res) => {
    const article = await Blog.findById(req.params.id);
    res.render("articles/edit", { article: article })
})

router.get("/:slug", async (req, res) => {
    const article = await Blog.findOne({ slug: req.params.slug })
    if (article == null) res.redirect("/")
    res.render("articles/show", { article: article })
})
router.post("/", async (req, res, next) => {
    req.article = new Blog()
    next()
}, saveArticleAndRedirect("new"))

router.put("/:id", async (req, res, next) => {
    req.article = await Blog.findById(req.params.id)
    next()
}, saveArticleAndRedirect("edit"))

router.delete("/:id", async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id)
    res.redirect("/")
})

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
        article.author = req.user.id
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
module.exports = router