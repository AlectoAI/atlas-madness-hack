const express = require('express')
const router = express.Router()
const Schemas = require('../models/Schemas.js')

router.get('/users', (req, res) => {
    const userData = 
    [
        {
            "name": "Codr Kai",
            "msg": "This is my first tweet!",
            "username": "codrkai"
        },
        {
            "name": "Samantha Kai",
            "msg": "React JS is so simple!",
            "username": "samanthakai"
        },
        {
            "name": "John K",
            "msg": "Sweep the leg!",
            "username": "johnk"
        }
    ]
    res.send(userData)
})

router.get("/fetchall", async (req, res) => {
    const celebImages = Schemas.celebImages
    const celebImageData = await celebImages.find({}).exec()
    if (celebImageData) {
        res.send(JSON.stringify(celebImageData))
    }
})

module.exports = router