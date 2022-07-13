const asyncHandler = require('express-async-handler')
const { isObjectIdOrHexString } = require('mongoose')
const mongoose = require('mongoose')
const Template = require('../models/template')

const getTemplate = asyncHandler(async (req, res) => {
    const { id } = req.body
    
    const template = Template.findOne({"_id": id})

    if (template) {
        res.status(201).json(template)
    }
    else 
    {
        res.status(400)
        throw new Error('Template not found')
    }
    
})

const saveTemplate = asyncHandler(async (req, res) => {
    const { id, name, onchart, offchart,uid} = req.body
     
    if(id ==0)
    {
        // Create Template
        const template = await Template.create({
            name: name,
            onchart: onchart,
            offchart: offchart,
            uid: mongoose.Types.ObjectId(uid)
        })
        
        if (template) {
            res.status(201).json({ id: template._id })
        } else {
            res.status(400)
            throw new Error('Template coundnt be saved.')
        }
    }
    else 
    {
        Template.findByIdAndUpdate(id, { name: name, onchart: onchart,offchart: offchart },
            function (err, docs) {
                if (err){
                    res.status(400)
                    throw new Error('Template not Found')
                }
                else{
                    res.status(201).json({status: 'updated'})
                }
            });
    }
    
    return 
})

module.exports = {
    getTemplate,
    saveTemplate
}