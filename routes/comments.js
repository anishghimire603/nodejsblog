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
            //add name and id to commnt
            comment.author.id = req.user._id
            comment.author.username = req.user.name
            //save comment
            comment.save()
            blog.comments.push(comment);
            blog.save();
            console.log(comment)
            res.redirect("/articles/" + blog.slug)
        })
    })
})

router.get("/:slug/comments/:id/edit", (req, res) => {
    Comment.findById(req.params.id, (err, comment) => {
        if (err) {
            console.log(err)
            req.redirect("back")
        } else {
            res.render("comments/edit", { slug: req.params.slug, comment: comment })

        }
    })
})

router.put('/:slug/comments/:id', async (req, res) => {
    console.log(req.params)
    try {
        console.log(req)
        await Comment.findByIdAndUpdate(req.params.id, req.body.text, { new: true })
        res.redirect("/articles/" + req.params.slug)

    } catch (err) {
        console.log(err)
        res.redirect("back")
    }
})



module.exports = router