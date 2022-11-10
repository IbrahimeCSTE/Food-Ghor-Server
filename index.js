const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const verifyJwt = require("./jwt");
require("dotenv").config();
// middle wares
const app = express();
app.use(cors());
app.use(express.json());

//port
const PORT = process.env.PORT || 5000;

//Mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tfzr2.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//router function
async function run() {
  try {
    const userCollection = client.db("foodghor").collection("user");
    const foodCollection = client.db("foodghor").collection("food");
    const reviewCollection = client.db("foodghor").collection("review");

    //user post register router
    app.post("/api/user/register", async (req, res) => {
      try {
        const user = req.body;
        // console.log(user);
        const payload = {
          user: {
            email: user.email,
          },
        };
        const token = jwt.sign(payload, process.env.JWT_SECRETE, {
          expiresIn: "1d",
        });
        res.status(200).send({ msg: "Login Successfully", token: token });
        // console.log(result);
      } catch (err) {
        console.log(err);
      }
    });
    //user post login router
    app.post("/api/user/login", async (req, res) => {
      try {
        const user = req.body;
        // console.log(user);
        const payload = {
          user: {
            email: user.email,
          },
        };
        const token = jwt.sign(payload, process.env.JWT_SECRETE, {
          expiresIn: "1d",
        });
        res
          .status(200)
          .send({ msg: "Registration Successfully", token: token });
      } catch (err) {
        console.log(err);
      }
    });

    //user get all register router
    app.get("/api/user", async (req, res) => {
      const result = await userCollection.find({}).toArray();
      res.status(200).send(result);
    });

    //food post section
    app.post("/api/food", async (req, res) => {
      try {
        const food = req.body;
        // console.log(food);
        await foodCollection.insertOne(food);
        res.status(200).send({ msg: "Food added" });
        // console.log(result);
      } catch (err) {
        console.log(err);
      }
    });
    //food get section
    app.get("/api/food", async (req, res) => {
      try {
        const showProduct = parseInt(req.query.qrt);
        const allFood = foodCollection.find({});
        if (showProduct) {
          const service = await allFood
            .sort({ time: -1 })
            .limit(showProduct)
            .toArray();
          // console.log(service);
          res.status(200).send(service);
        } else {
          const service = await allFood.toArray();
          // console.log(service);
          res.status(200).send(service);
        }
      } catch (err) {
        console.log(err);
      }
      // console.log(result);
    });
    //single food get api
    app.get("/api/food/:id", async (req, res) => {
      try {
        const foodId = req.params.id;
        const singleFoot = await foodCollection.findOne({
          _id: ObjectId(foodId),
        });
        res.status(200).send(singleFoot);
        // console.log(result);
      } catch (err) {
        console.log(err);
      }
    });

    //review post api
    app.post("/api/review", async (req, res) => {
      try {
        const review = req.body;
        //console.log(review);
        await reviewCollection.insertOne(review);
        res.status(200).send({ msg: "review added" });
        // console.log(result);
      } catch (err) {
        console.log(err);
      }
    });
    //review get api
    app.get("/api/myreview", verifyJwt, async (req, res) => {
      try {
        const email = req.query.email;
        const review = await reviewCollection.find({}).toArray();
        if (email) {
          const myReview = review.filter((rv) => rv.email === email);
          //console.log(myReview);
          res.status(200).send(myReview);
        } else {
          res.status(200).send({ msg: "No Review" });
        }
      } catch (err) {
        console.log(err);
      }
    });
    app.get("/api/review", async (req, res) => {
      try {
        const review = await reviewCollection.find({}).toArray();
        res.status(200).send(review);
        // console.log(result);
      } catch (err) {
        console.log(err);
      }
    });
    //review delete api
    app.delete("/api/review/:id", async (req, res) => {
      try {
        const id = req.params.id;
        // console.log(id);
        await reviewCollection.deleteOne({ _id: ObjectId(id) });
        res.status(200).send({ msg: "review deleted" });
      } catch (err) {
        console.log(err);
      }
    });
    //review edit api
    app.patch("/api/review/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const updatedReview = {
          $set: {
            review: req.body.editReview,
          },
        };
        await reviewCollection.updateOne(query, updatedReview);
        res.status(200).send({ msg: "updeted" });
      } catch (err) {
        console.log(err);
      }
    });

    //test api
    app.get("/", (req, res) => {
      res.status(200).send("Hi server!");
    });
  } catch (err) {
    // console.log(err);
  }
}
run().catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
