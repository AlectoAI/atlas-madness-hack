const mongoose = require('mongoose')
const Schema = mongoose.Schema

const celebImagesSchema = new Schema({

    imagename: {
        type: String,
        required: [true, 'imagename must have name'],
        trim: true,
        unique: true,
      },
      photoSource: {
        type: String,
        required: [true, 'photoSource must have position'],
        trim: true,
      },
      photoVector: {
        type: Array,
        required: [true, 'photoVector is required'],
        trim: true,
      },

})

const celebImages = mongoose.model('celeb_images', celebImagesSchema, 'celeb_images')
const mySchemas = {'celebImages':celebImages}

module.exports = celebImages