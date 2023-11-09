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

        //HTML Output
        res.render('index.ejs' )                                        //---> public içerisinde bulunan index'ten al diyorum. çünkü verinin geldiği route farklı. Statik 
                                                                      //---> dosya çağırma kurallarına uymam gerekior.
    },

    listCategoryPosts: async (req, res) => {

        const data = await BlogPost.find({ blogCategoryId: req.params.categoryId }).populate('blogCategoryId')

        res.status(200).send({
            error: false,
            count: data.length,
            result: data
        })
    },

    create: async (req, res) => {
        const data = await BlogPost.create(req.body)

        res.status(201).send({
            error: false,
            body: req.body,
            result: data,
        })
    },

    read: async (req, res) => {
        const data = await BlogPost.findOne({ _id: req.params.postId }).populate('blogCategoryId') // get Primary Data

        res.status(200).send({
            error: false,
            result: data
        })

    },

    update: async (req, res) => {
        const data = await BlogPost.updateOne({ _id: req.params.postId }, req.body, { runValidators: true })

        res.status(202).send({
            error: false,
            body: req.body,
            result: data, // update infos
            newData: await BlogPost.findOne({ _id: req.params.postId })
        })

    },

    delete: async (req, res) => {
        
        const data = await BlogPost.deleteOne({ _id: req.params.postId })

        res.sendStatus( (data.deletedCount >= 1) ? 204 : 404 )

    },
}