const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 5000;
app.use(cors());
app.get("/", (req, res) => {
  res.status(200).send("Hi server!");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
