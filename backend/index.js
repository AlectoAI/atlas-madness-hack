const fs = require('fs')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require('./routes/router.js')
const mongoose = require('mongoose')
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv/config.js")

const celebImages = require('./models/Schemas.js')
const app = express()

//app.use(express.json())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use('/', router)

const dbOptions = {useNewurlParser:true, useUnifiedTopology:true}
mongoose.connect(process.env.DB_URI)
.then(() => console.log('DB Connected!'))
.catch(err => console.log(err))

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//     }
//   });
  
  
// async function run() {
// try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
// } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
// }
// }
// run().catch(console.dir);


const data = JSON.parse(fs.readFileSync('./celeb_images.json', 'utf-8'))
console.log(data)
const importData = async () => {
    try {
      await celebImages.create(data)
      console.log('data successfully imported')
      // to exit the process
      process.exit()
    } catch (error) {
      console.log('error', error)
    }
  }

importData()

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log('Server is running on port ${port}')
})