const router = require("express").Router()
const Blog = require("../Database/models/blogModel")
const Comment = require("../Database/models/commentModel")
const { ensureAuthenticated } = require("../config/auth")

router.get("/:slug/comments/new", ensureAuthenticated, (req, res) => {
    Blog.findOne({ slug: req.params.slug }, (err, blog) => {
        if (err) {
            console.log(err)
        }
        res.render('comments/new', { blog: blog })

    })
})

router.post("/:slug/comments", ensureAuthenticated, (req, res) => {
    Blog.findOne({ slug: req.params.slug }, (err, blog) => {
        if (err) {
            console.log(err);
            res.redirect("/articles/:slug")
        }
        Comment.create({
            text: req.body.text,
            author: req.body.author
        }, (err, comment) => {
            if (err) {
                console.log(err)
            }
            console.log(comment)
            blog.comments.push(comment);
            console.log(blog)
            blog.save();
            res.redirect("/articles/" + blog.slug)
        })
    })
})


module.exports = router