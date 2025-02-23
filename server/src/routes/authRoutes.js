const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();
const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const usersTable = base(process.env.AIRTABLE_USERS_TABLE);


const users = [];


router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await usersTable.create([
        {
            fields: {
                username,
                password: hashedPassword,
            },
        },
    ]);

    res.status(201).json({ message: "User registered successfully" });
} catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error" });
}
});


// router.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   const user = users.find((user) => user.username === username);

//   if (!user) {
//     return res.status(400).json({ message: "Invalid username or password" });
//   }

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return res.status(400).json({ message: "Invalid username or password" });
//   }

//   const token = jwt.sign(
//     { id:user.id,
//     username: user.username ,email: user.email}, process.env.JWT_SECRET, { expiresIn: '1h' });

//   res.json({ token });
// });


router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    try {
        const userRecord = await usersTable.select({
            filterByFormula: `{username} = '${username}'`,
        }).firstPage();

        if (userRecord.length === 0) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const user = userRecord[0].fields;
        
      
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

       
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });


        res.json({ token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
