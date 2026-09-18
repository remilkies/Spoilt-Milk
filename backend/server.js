require ('dotenv').congig();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const skeletonKey = process.env.MONGO_URI;
console.log("Cheaking the skeleton keys...");
console.log("--- Entering Xibalba ---");

if (!skeletonKey){
    console.error("Error: MONGO_URI is not defined in the environment variables.");
    process.exit(1);
}

mongoose.connect(skeletonKey)
    .then(() => console.log("Connection to the underworld established"))
    .catch((err) => console.error("Database connection failed:", err))


