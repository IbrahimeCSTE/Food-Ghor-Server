const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
// middle wares
const app = express();
app.use(cors());
app.use(express.json());

//port
const PORT = process.env.PORT || 5000;

//Mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tfzr2.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const client = new MongoClient(
  uri,
  function (err, db) {
    if (err) {
      console.log(err);
    } else {
      console.log("Database created!");
    }
  },
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  }
);

//router function
async function run() {
  try {
    const userCollection = client.db("foodghor").collection("user");

    //user post register router
    app.post("/api/user/register", async (req, res) => {
      const alreadyUser = await userCollection.findOne({
        email: req.body.email,
      });
      if (alreadyUser) {
        res.status(200).send("User already registed");
      } else {
        const user = req.body;
        await userCollection.insertOne(user);
        res.status(200).send("Registration Successfully");
        // console.log(result);
      }
    });
    //user post login router
    app.post("/api/user/login", async (req, res) => {
      //const alreadyUser = req.body.email;
      const alreadyUser = await userCollection.findOne({
        email: req.body.email,
      });
      if (!alreadyUser) {
        res.status(200).send("Email isn't registed");
      } else {
        res.send(alreadyUser);
      }

      //console.log(alreadyUser);
    });
    //user get all register router
    app.get("/api/user", async (req, res) => {
      const result = await userCollection.find({}).toArray();
      res.status(200).send(result);
    });

    app.get("/", (req, res) => {
      res.status(200).send("Hi server!");
    });
  } catch (err) {
    console.log(err);
  }
}
run().catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
