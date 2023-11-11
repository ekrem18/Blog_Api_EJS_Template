"use strict"
/* ------------------------------------------------------- */
const router = require('express').Router()

// Call Controllers:
const { BlogCategory:blogCategoryView, BlogPost:blogPostView } = require('../controllers/blogControllerView')

router.all('/', (req, res)=>{
    res.redirect('/post')                               //---> daha kısa yönlendirme mümkün olsa da pratik-training olması amacıyla bu şekilde yapıyorum.               
})                                                    //---> alttakilere /post demezsem anasayfaya geldiğinde zaten redirect olacak

router.all('/post', blogPostView.list)
router.all('/post/create', blogPostView.create)
router.all('/post/:postId', blogPostView.read)
router.all('/post/:postId/update', blogPostView.update)
router.all('/post/:postId/delete', blogPostView.delete)

//USER
const {User: userView} = require('../controllers/userControllerView')

router.all('/login', userView.login)
router.all('/logout', userView.logout)

module.exports = router


