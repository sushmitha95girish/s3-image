const aws = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid').v4;
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const { Image } = require('./models/image');

const app = express();

//module.exports = function () {
//mongoose.connect('mongodb://localhost/vidly') //FOR LOCAL
mongoose.connect("mongodb+srv://sushmitha:sushmitha@cluster0.gjnt2sv.mongodb.net/test", {
  useNewUrlParser: true, useUnifiedTopology: true,
})
  .then(client => {
    console.log('mongo connected');
    //const db = client.db('myApp');
    //const collection = db.collection('images');
    //app.locals.imageCollection = collection;

  });
//}

const s3 = new aws.S3({ apiVersion: '2006-03-01' });
// Needs AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'benaka-common',
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname })
    },
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuid()}${ext}`);
    }
  })
});

app.use(express.static('public'));

app.post('/upload', upload.single('appImage'), (req, res) => {
  //const imageCollection = req.app.locals.imageCollection;
  const uploaded = req.file.location;
  console.log(req.file);

  Image.insert({ filePath: uploaded })
    .then(result => {
      return res.json({ status: 'OK', ...result });
    });
});

app.get('/images', (req, res) => {
  //const imageCollection = req.app.locals.imageCollection;
  Image.find({})
    .toArray()
    .then(image => {
      const paths = image.map(({ filePath }) => ({ filePath }));
      return res.json(paths);
    })

});


app.listen(3005, () => console.log('App is listening'));



//export AWS_ACCESS_KEY_ID=AKIA3WGRLQMFRNLSMF6E
//export AWS_SECRET_ACCESS_KEY=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