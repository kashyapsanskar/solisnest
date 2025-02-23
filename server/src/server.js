const express = require("express");

const bodyParser = require('body-parser');
const jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');



require("dotenv").config();


const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes"); 
const authRoutes=require("./routes/authRoutes");

const app = express();
const cors = require("cors");

app.use(
  cors({
    // origin: 'https://solisnest-new-git-main-sanskar-kashyaps-projects.vercel.app', 
    origin: '*',

    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes); 
app.use("/api/auth",authRoutes);

const PORT = process.env.PORT || 5001;
app.get("/", (req, res) => {
    res.json({ message: "API is running..." });
  });
  
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
