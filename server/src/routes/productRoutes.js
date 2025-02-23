const express = require("express");
const router = express.Router();
const multer=require("multer");
const path=require("path");

const Airtable=require("airtable");
require("dotenv").config();







router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json([]);

    let results = [];

    await base(process.env.AIRTABLE_PRODUCTS_TABLE)
      .select({
        filterByFormula: `SEARCH("${query}", {name})`, 
        maxRecords: 10, 
      })
      .eachPage((records, fetchNextPage) => {
        records.forEach((record) => {
          results.push({
            id: record.id,
            name: record.fields.name,
            image: record.fields.image ? record.fields.image[0].url : null, 
          });
        });
        fetchNextPage();
      });

    res.json(results);
  } catch (error) {
    console.error("Airtable search error:", error);
    res.status(500).json({ message: "Server error" });
  }
});







  
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); 
    },
  });

const upload = multer({ storage });
   
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const productsTable = base(process.env.AIRTABLE_PRODUCTS_TABLE);
const authenticate = require("../middleware/authMiddleware");


router.get("/public", async (req, res) => {
    try {
      console.log("Fetching all public products...");
      
     
      const records = await productsTable.select().all();
  
      
      const products = records.map((record) => ({
        id: record.id,
        ...record.fields,
      }));
  
      console.log("Fetched Products:", products);
      res.json(products);
    } catch (error) {
      console.error("Airtable Fetch Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });


router.use(authenticate);

const products=[];


    router.post("/", authenticate, upload.single("image"), async (req, res) => {
        console.log("Decoded User:", req.user);
        console.log("Received Body:", req.body);
        console.log("Received File:", req.file); 
    
        const userId = req.user?.email;
        console.log("Creating products for userId:", userId);
    
        if (!userId) {
            return res.status(400).json({ message: "User authentication failed" });
        }
    
    
    let { name, description, price } = req.body;
    const imagePath = req.file ?  `http://localhost:5001/uploads/${req.file.filename}`: null;

    if (!name || !description || !price || !imagePath) {
        return res.status(400).json({ message: "All fields are required" });
    }

        try {
         
            const createdRecords = await productsTable.create([
                {
                    fields:{
                        name,  
                        description,
                        price: Number(price),
                        image: [{ url: imagePath }],  
                        userId: userId, 
                    },
                },
            ]);
    
            if (!createdRecords || createdRecords.length === 0) {
                throw new Error("Airtable did not return a created record.");
            }
    
            const createdRecord = createdRecords[0]; 

            console.log("✅ Created Record:", createdRecord);
    
         
            const updatedRecord = await productsTable.update([
                {
                    id: createdRecord.id,
                    fields: { uniqueId: createdRecord.id },
                },
            ]);
            console.log("🔄 Updated Record:", updatedRecord);
    
          
            res.status(201).json({
                uniqueId: updatedRecord[0].id,
                id: updatedRecord[0].id,
                ...updatedRecord[0].fields,
            });
    
        } catch (error) {
            console.error("Airtable Error:", error);
            res.status(500).json({ message: "Server error" });
        }
    });
    
   
    router.get("/",authenticate, async (req, res) => {
      try { 
        const userId=req.user.email;
        console.log("Fetching products for userId:", userId); 
        const records = await productsTable
        .select({ filterByFormula: `{userId} = '${userId}'` })
        .firstPage();
        console.log("Fetched Records:",records);
        const products = records.map((record) => ({
          id: record.id,
          ...record.fields,
        }));
    
        res.json(products);
      } catch (error) {
        console.error("Airtable Fetch Error:", error);
        res.status(500).json({ message: "Server error" }); 
      }
    });
    router.get("/:id", async (req, res) => {
        const { id } = req.params;
    
        try {
            const record = await productsTable.find(id);
            if (!record) {
                return res.status(404).json({ message: "Product not found" });
            }
    
            res.json({
                id: record.id,
                ...record.fields,
            });
        } catch (error) {
            console.error("Airtable Fetch Error:", error);
            res.status(500).json({ message: "Server error" });
        }
    });

   
router.put('/:id',upload.single("image"), async (req, res) => {
    console.log("🟢 PUT request received at /api/products/:id");
    console.log("🔹 Request Params:", req.params);  
    console.log("🔹 Request Body:", req.body);  
    console.log("🔹 Received Image File:", req.file);  
  
    try {
        const { id } = req.params; 
        console.log("🔍 Searching Airtable for uniqueId:", id);  
  
        const { name, description, price } = req.body; 
        const image = req.file ? `http://localhost:5001/uploads/${req.file.filename}` : undefined; 
  
       
        const records = await productsTable
            .select({ filterByFormula: `{uniqueId} = '${id}'` })
            .firstPage();
  
        console.log("🔎 Found Records in Airtable:", records.length); 
        

        if (!records.length) {
            console.log("❌ Product not found in Airtable."); 
            return res.status(404).json({ message: "Product not found" });
        }
  
        const existingRecord = records[0]; 
  
        
        const updatedPrice = price ? Number(price) : existingRecord.fields.price;
        console.log("🔧 Updated Price:", updatedPrice);  
  
        
        const updatedFields = {
            name: name?.trim() ? name : existingRecord.fields.name,
            description: description?.trim() ? description : existingRecord.fields.description,
            price: updatedPrice,
            image: image ? [{url:image}] : existingRecord.fields.image,
            userId: existingRecord.fields.userId,
            uniqueId: existingRecord.fields.uniqueId,
        };

        
        if (req.file) {
            console.log("📸 New Image Path:", req.file.path);
         
            updatedFields.image = [{ url: `http://localhost:5001/uploads/${req.file.filename}` }];
        }
        console.log("🛠 Final Update Payload:", updatedFields);

        
        const updatedProduct = await productsTable.update([
            {
                id: existingRecord.id,
                fields: updatedFields,
            },
        ]);
  
        console.log("✅ Updated Product Response:", updatedProduct);  
     
        res.status(200).json(updatedProduct[0]);
    } catch (error) {
        console.error("❌ Update Error:", error); 
        res.status(500).json({ error: error.message });
    }
});

      
    router.delete("/:id",async(req,res)=>{
        try{
            const{id}=req.params;
            await productsTable.destroy(id);
            res.status(200).json({message:"Product deleted successfully"});
        }catch (error){
            res.status(500).json({
                error:error.message
            });
        }
    })
    
    module.exports = router;