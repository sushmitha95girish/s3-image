const express = require('express');
const multer = require('multer');
const path = require('path');
const uuid = require('uuid').v4;
const mongoose = require('mongoose');
const Image = require('./models/image');

mongoose.connect("mongodb+srv://sushmitha:sushmitha@cluster0.gjnt2sv.mongodb.net/test", {
  useNewUrlParser: true, useUnifiedTopology: true,
}).then(() => {
  console.log('database connected')
})


const connect = mongoose.connect;
mongoose.connection.on('error', console.log);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const id = uuid();
    const filePath = `image/${id}${ext}`;
    Image.create({ filePath })
      .then(() => {
        cb(null, filePath);
      });
  }
});
const upload = multer({ storage });
const app = express();

app.use(express.static('public'));
app.use(express.static('uploads'));

app.post('/upload', upload.array('avatar'), (req, res) => {
  return res.redirect('/');
});
app.get('/images', (req, res) => {
  Image.find()
    .then((image) => {
      return res.json({ status: 'ok', images })
    });
});

app.listen(3001);