// backend/seed.js
const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();  // Load environment variables


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");


    // Insert initial data into the products collection
    return Product.insertMany([
      {
        name: "Apple",
        price: 50,
        quantity: 100,
        category: "Fruit",
        image: "Backend\images\apple.jpg"  // Placeholder path; update once actual image uploaded
      },
      {
        name: "Banana",
        price: 30,
        quantity: 150,
        category: "Fruit",
        image: "uploads/banana.jpg"  // Placeholder path; update once actual image uploaded
      },
      {
        name: "Orange",
        price: 40,
        quantity: 200,
        category: "Fruit",
        image: "uploads/orange.jpg"  // Placeholder path; update once actual image uploaded
      }
    ]);
  })
  .then(() => {
    console.log("Data seeded successfully!");
    process.exit();  // Exit the process after seeding is done
  })
  .catch((err) => {
    console.error("Error seeding data:", err);
    process.exit(1);  // Exit the process if there's an error
  });


