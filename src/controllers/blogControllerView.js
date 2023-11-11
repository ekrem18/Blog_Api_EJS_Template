"use strict"
/* ------------------------------------------------------- */
// Catch async-errors and send to errorHandler:
require('express-async-errors')

/* ------------------------------------------------------- */

// Call Models:
const { BlogCategory, BlogPost } = require('../models/blogModel')

/* ------------------------------------------------------- */
// BlogPost
module.exports.BlogPost = {

    list: async (req, res) => {

        const data = await res.getModelList(BlogPost, 'blogCategoryId')

        // res.status(200).send({
        //     error: false,
        //     count: data.length,                                      //---> çıktı olarak JSON veriypr bu blok. HTML çıktısı almak istediğim için render ediyorum
        //     details: await res.getModelListDetails(BlogPost),
        //     result: data,
        // })

        const categories = await BlogCategory.find()
        const recentPosts = await BlogPost.find().sort({ createdAt: 'desc' }).limit(3)

         // Add '?' parameters to url if there is not:
         if (!req.url.includes('?')) req.url += '?'

        //HTML Output   
        // res.render('index.ejs', {      
        res.render('postList.ejs', {      
            user: req.session?.user,
            details: await res.getModelListDetails(BlogPost),          //---> public içerisinde bulunan index'ten al diyorum. çünkü verinin geldiği route farklı.
            categories,                                                //---> Statik dosya çağırma kurallarına uymam gerekior.
            posts: data,  
            recentPosts,  
            pageUrl: req.url.replace(/[?|&]page=([^&]+)/gi, '')        //---> sayfa geçişlerinde her sayfayı url'ye eklemesini engelliyorum  
        } )                                         
    },                                                                 

    create: async (req, res) => {

        if (req.method == 'POST') {
            //post create işlemi için gerekli olan id'yi login olan kullanıcıdan al diyorum
            req.body.userId = req.session.user.id

            const data = await BlogPost.create(req.body)

            res.redirect('/post/' + data.id)

        } else {

            res.render('postForm', {
                user: req.session?.user,
                categories: await BlogCategory.find(),
                post: null
            })
        }
    },

    read: async (req, res) => {
        const data = await BlogPost.findOne({ _id: req.params.postId }).populate('blogCategoryId') // get Primary Data

       res.render('postRead', {
        user: req.session?.user,
        post: data, 
       })

    },

    update: async (req, res) => {

        if(req.method == 'POST') {
            const data = await BlogPost.updateOne({ _id: req.params.postId }, req.body, { runValidators: true })

            res.redirect('/post/' + req.params.postId)                          //---> bir form gönderme işi varsa post işlemi için burası
        
        }else{ 
           
            res.render('postForm', {                                            //---> ancak, görüntüleme varsa postForm dosyasını çalıştırıyorum
                user: req.session?.user,
                categories: await BlogCategory.find(),                          //---> ve mevcut verilerin forma gelmesi için de devamını yazdım
                post: await BlogPost.findOne({ _id: req.params.postId }).populate('blogCategoryId') 
            })
        }   
    },

    delete: async (req, res) => {
        
        const data = await BlogPost.deleteOne({ _id: req.params.postId })

        // res.sendStatus( (data.deletedCount >= 1) ? 204 : 404 )

        res.redirect('/')

    },
}