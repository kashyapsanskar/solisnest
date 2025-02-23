const express = require("express");
const router = express.Router();
const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);// Ensure correct path

const ordersTable = base(process.env.AIRTABLE_ORDERS_TABLE);
const productsTable=base(process.env.AIRTABLE_PRODUCTS_TABLE);
const authenticate = require("../middleware/authMiddleware");


router.use(authenticate);


router.post("/", authenticate, async (req, res) => {
    try {
        const { productUniqueId, status } = req.body;
        console.log("🔹 Received productUniqueId:", productUniqueId);

      
        if (!productUniqueId || !Array.isArray(productUniqueId) || productUniqueId.length === 0) {
            console.log("🚨 Invalid product ID received:", productUniqueId);
            return res.status(400).json({ message: "Invalid product ID format. Must be an array of record IDs." });
        }

       
        if (!req.user || !req.user.email) {
            return res.status(401).json({ message: "Unauthorized. Invalid token." });
        }

        
        const buyerName = req.user.name || "Unknown Buyer"; 
        const buyerEmail = req.user.email;

      
        if (!buyerEmail || !status) {
            return res.status(400).json({ message: "All fields are required" });
        }

        
        const productRecords = await productsTable
    .select({ filterByFormula: `{uniqueId} = '${productUniqueId[0]}'` }) 
    .firstPage();
        
            console.log("🔹 Raw Airtable Response:", JSON.stringify(productRecords, null, 2));
            console.log("🔹 Extracted Product ID:", productRecords[0].id);


        if (!productRecords || productRecords.length === 0) {
            console.log("🚨 Product not found in Airtable for ID:", productUniqueId[0]);
            return res.status(404).json({ message: "Product not found. Cannot place an order." });
        }

     
        const orderData = {
            "productUniqueId": [productRecords[0].id],
            "Buyer Name": buyerName,
            "Buyer Email": buyerEmail,
            "Status": "Placed",
        
        };
        console.log("🟢 Creating Order with:", JSON.stringify(orderData, null, 2));

        const createdRecord = await ordersTable.create([{ fields: orderData }]);
        console.log("✅ Order Created:", JSON.stringify(createdRecord, null, 2));

        res.status(201).json(createdRecord[0].fields);
    } catch (error) {
        console.error("❌ Error placing order:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});






// router.get("/", async (req, res) => {
//     try {
//         const userEmail=req.user.email;
//         const records = await ordersTable
//         .select({
//             filterByFormula: `{Buyer Email} = '${userEmail}'` // Airtable Query to filter
//         })
//         .all();

//         console.log("Fetched Orders:", records.map(record => record.fields)); // Debug Log

//         const orders = records.map((record) => ({
//             id: record.id,
//             ...record.fields, // This should include productId, buyerName, etc.
//         }));

//         res.status(200).json(orders);
//     } catch (error) {
//         console.error("Airtable Fetch Error:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// });
// router.get("/", authenticate, async (req, res) => {
//     try {
//         const records = await ordersTable.select().all();

//         // Ensure JWT middleware sets `req.user.email`
//         // if (!req.user || !req.user.email) {
//         //     return res.status(401).json({ message: "Unauthorized. Invalid token." });
//         // }

//         // Filter orders for the authenticated user
//         const userOrders = records
//             .map(record => ({ id: record.id, ...record.fields }))
//             .filter(order => order["Buyer Email"] === req.user.email);

//         if (userOrders.length === 0) {
//             return res.status(404).json({ message: "No orders found for this user." });
//         }

//         res.status(200).json(userOrders);
//     } catch (error) {
//         console.error("Airtable Fetch Error:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// });
// router.get("/", authenticate, async (req, res) => {
//     try {
//         // Ensure the JWT middleware sets `req.user.email`
//         if (!req.user || !req.user.email) {
//             return res.status(401).json({ message: "Unauthorized. Invalid token." });
//         }

//         const userEmail = req.user.email;

//         // Fetch orders only for the authenticated user
//         const records = await ordersTable
//             .select({
//                 filterByFormula: `{Buyer Email} = '${userEmail}'`
//             })
//             .all();

//         const orders = records.map(record => ({
//             id: record.id,
//             ...record.fields,
//         }));

//         res.status(200).json(orders);
//     } catch (error) {
//         console.error("Airtable Fetch Error:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// }); actual one
// router.get("/", authenticate, async (req, res) => {
//     try {
//         if (!req.user || !req.user.email) {
//             return res.status(401).json({ message: "Unauthorized. Invalid token." });
//         }

//         const userEmail = req.user.email;

//         // Fetch orders for the authenticated user
//         const records = await ordersTable
//             .select({
//                 filterByFormula: `{Buyer Email} = '${userEmail}'`
//             })
//             .all();

//         // Fetch full product details from the Products table
//         const orders = await Promise.all(
//             records.map(async (record) => {
//                 const fields = record.fields;

//                 // Extract product ID (Airtable linked field)
//                 const productId = Array.isArray(fields["Product Id"]) ? fields["Product Id"][0] : fields["Product Id"];

//                 let productDetails = {};
//                 if (productId) {
//                     const productRecord = await productsTable.find(productId);
//                     productDetails = productRecord ? productRecord.fields : {};
//                 }

//                 return {
//                     id: record.id,
//                     status: fields.Status,
//                     buyerEmail: fields["Buyer Email"],
//                     buyerName: fields["Buyer Name"] || fields["Buyer Email"],  // Use email if name is missing
//                     product: {
//                         id: productId,
//                         name: productDetails.Name || "Unknown Product",
//                         price: productDetails.Price || "N/A",
//                         image: productDetails.Image ? productDetails.Image[0].url : null,
//                     },
//                 };
//             })
//         );

//         res.status(200).json(orders);
//     } catch (error) {
//         console.error("Airtable Fetch Error:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// });


// router.get("/", authenticate, async (req, res) => {
//     try {
//         if (!req.user || !req.user.email) {
//             return res.status(401).json({ message: "Unauthorized. Invalid token." });
//         }

//         const userEmail = req.user.email;

//         // Fetch orders for the authenticated user
//         const records = await ordersTable
//             .select({
//                 filterByFormula: `{Buyer Email} = '${userEmail}'`
//             })
//             .all();

//         const orders = records.map((record) => {
//             const fields = record.fields;

//             return {
//                 id: record.id,
//                 status: fields.Status || "Pending",  // Default to Pending if status is missing
//                 buyerEmail: fields["Buyer Email"],
//                 product: {
//                     name: fields.productUniqueId || "Unknown Product",  // ✅ Use productUniqueId for name
//                 },
//             };
//         });

//         res.status(200).json(orders);
//     } catch (error) {
//         console.error("Fetch Error:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// });
// router.get("/", authenticate, async (req, res) => {
//     try {
//         if (!req.user || !req.user.email) {
//             return res.status(401).json({ message: "Unauthorized. Invalid token." });
//         }

//         const userEmail = req.user.email;

//         // Fetch orders for the authenticated user
//         const records = await ordersTable
//             .select({
//                 filterByFormula: `{Buyer Email} = '${userEmail}'`
//             })
//             .all();

//         // Fetch product details for each order
//         const orders = await Promise.all(records.map(async (record) => {
//             const fields = record.fields;
//             const productId = fields.productUniqueId;  // Product ID from orders table

//             let productName = "Unknown Product";
            
//             if (productId) {
//                 // Fetch product details from Products table
//                 const productRecord = await productsTable
//                     .select({ filterByFormula: `{uniqueId} = '${productId}'` })
//                     .firstPage();
                
//                 if (productRecord.length > 0) {
//                     productName = productRecord[0].fields.productName || "Unnamed Product";
//                 }
//             }

//             return {
//                 id: record.id,
//                 status: fields.Status || "Pending",
//                 buyerEmail: fields["Buyer Email"],
//                 product: {
//                     id: productId,
//                     name: productName,  // ✅ Fetch product name instead of ID
//                 },
//             };
//         }));

//         res.status(200).json(orders);
//     } catch (error) {
//         console.error("Fetch Error:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// });
router.get("/", authenticate, async (req, res) => {
    try {
        if (!req.user || !req.user.email) {
            return res.status(401).json({ message: "Unauthorized. Invalid token." });
        }

        const userEmail = req.user.email;

        
        const records = await ordersTable
            .select({ filterByFormula: `{Buyer Email} = '${userEmail}'` })
            .all();

        const orders = await Promise.all(records.map(async (record) => {
            const productUniqueId = record.fields.productUniqueId; 
          
            const productRecords = await productsTable
                .select({ filterByFormula: `{uniqueId} = '${productUniqueId}'` })
                .firstPage();

            const product = productRecords.length > 0 ? productRecords[0].fields : null;

            return {
                id: record.id,
                productName: product ? product.name : "Unnamed Product",  
                productDescription: product ? product.description : "No description available",
                productPrice: product ? product.price : "N/A",
                productImage: product ? product.image : null,
                status: record.fields.Status,
                buyerEmail: record.fields["Buyer Email"],
            };
        }));

        res.status(200).json(orders);
    } catch (error) {
        console.error("Airtable Fetch Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});






// router.get("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const record = await ordersTable.find(id);

//     if (!record || !record.fields) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     res.status(200).json({ id: record.id, ...record.fields });
//   } catch (error) {
//     if (error.error === "NOT_FOUND") {
//       return res.status(404).json({ error: "Order not found" });
//     }
//     console.error("Airtable Fetch Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });
// router.get("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const record = await ordersTable.find(id);

//         if (!record || !record.fields) {
//             return res.status(404).json({ message: "Order not found." });
//         }

//         // Ensure the user can only access their own order
//         if (record.fields["Buyer Email"] !== req.user.email) {
//             return res.status(403).json({ message: "Unauthorized to view this order." });
//         }

//         res.status(200).json({ id: record.id, ...record.fields });
//     } catch (error) {
//         if (error.error === "NOT_FOUND") {
//             return res.status(404).json({ message: "Order not found." });
//         }
//         console.error("Airtable Fetch Error:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// });
router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      const records = await productsTable
        .select({ filterByFormula: `{Product ID} = '${id}'` })
        .all();
  
      if (records.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.json({ recordId: records[0].id }); 
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  



router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const updatedOrder = await ordersTable.update([
      {
        id,
        fields: { status },
      },
    ]);

    res.status(200).json(updatedOrder[0].fields);
  } catch (error) {
    console.error("Airtable Update Error:", error);
    res.status(500).json({ error: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await ordersTable.destroy(id);

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Airtable Delete Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
