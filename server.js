const express = require("express");

const cors = require("cors");

const axios = require("axios");

require("dotenv").config();

const server = express();

server.use(cors());

server.use(express.json());

const mongoose = require("mongoose");
const PORT = process.env.PORT;

mongoose.connect(
  "mongodb+srv://Cyclones:qo9RlYwKjvSc1FIO@cluster0.amjwr.mongodb.net/retake?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const fruitSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: String,
});

const userSchema = new mongoose.Schema({
  email: String,
  fruit: [fruitSchema],
});

const UserModel = mongoose.model("user", userSchema);

function SeedUserData() {
  let thaer = new UserModel({
    email: "thaer.fjomhawi@gmail.com",
    fruit: [
      {
        name: "Apple",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/265px-Red_Apple.jpg",
        price: 35,
      },
    ],
  });
  thaer.save();
  console.log(thaer);
}

// SeedUserData();

function home(req, res) {
  res.send("Hello retaker");
}

function getApiData(req, res) {
  let apiUrl = process.env.API_URL;
  axios.get(apiUrl).then((result) => {
    res.send(result.data.fruits);
  });
}

function getFav(req, res) {
  let email = req.params.email;
  UserModel.find({ email: email }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
}
function creatFav(req, res) {
  const { name, image, price } = req.body;
  let email = req.params.email;
  UserModel.findOne({ email: email }, (err, result) => {
    result.fruit.push({
      name: name,
      image: image,
      price: price,
    });
    result.save();
    res.send(result);
  });
}
function deleteFav(req, res) {
  let email = req.params.email;
  let id = req.params.id;
  UserModel.findOne({ email: email }, (err, result) => {
    result.fruit.splice(id, 1);
  });
  res.send(result);
}

function updateFav(req, res) {
  let email = req.params.email;
  let id = req.params.id;
  let data ={ name:req.body.name, image:req.body.image, price:req.body.price}
  UserModel.findOne({email:email},(err,result)=>{
      if(err){res.send(err)}
      else{result.fruit.splice(id,1,data)}
  })
  res.send(result)
}

server.get("/", home);
server.get("/retrieve",getApiData);
server.get("/fav-list/:email",getFav)
server.post('/create/:email',creatFav)
server.delete('/delete/:email/:id',deleteFav)
server.put('/update/:email/:id',updateFav)
server.listen(PORT, () => {
  console.log(`I am a live at ${PORT}`);
});
