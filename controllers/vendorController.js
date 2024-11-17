// Import necessary modules

const Vendor = require("../models/Vendor");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const dotEnv = require("dotenv");
const { get } = require("mongoose");

// Load environment variables from .env file
dotEnv.config();

// Get the secret key from environment variables (used for signing JWT tokens)
const serectKey = process.env.whatIsYourName;

// Vendor registration function
const vendorRegister = async (req, res) => {
  // Extract the user details from the request body
  const { username, email, password } = req.body;
  try {
    const vendorEmail = await Vendor.findOne({ email });
    if (vendorEmail) {
      // If email exists, send a response indicating the email is already taken
      return res.status(400).json("Email already taken");
    }
    // Hash the password before saving it to the database
    const hashedpassword = await bcrypt.hash(password, 10);
    // Create a new vendor instance with the provided details
    const newVendor = new Vendor({
      username,
      email,
      password: hashedpassword, // Save the hashed password, not the plain text password
    });
    // Save the new vendor to the database
    await newVendor.save();

    // Respond with a success message
    res.status(201).json({ message: "Vendor Registered Successfully" });

    // Log the successful registration (for debugging purposes)
    console.log("Registered");
  } catch (error) {
    // Handle errors if any occur during the registration process
    console.log(error);

    // Send a generic error response
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Vendor login function
const vendorLogin = async (req, res) => {
  // Extract email and password from the request body
  const { email, password } = req.body;
  try {
    // Find the vendor by email in the database
    const vendor = await Vendor.findOne({ email });
    // Check if the vendor exists and if the password is correct
    if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
      // If the vendor doesn't exist or the password is incorrect, send an error response
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // If credentials are valid, create a JWT token
    const token = jwt.sign({ vendorId: vendor._id }, serectKey, {
      expiresIn: "1h", // The token will expire in 1 hour
    });

    // Respond with a success message and the JWT token
    res.status(200).json({ success: "Login Successful", token });

    // Log the email and token for debugging (not recommended in production)
    console.log(email, "this is token", token);
  } catch (error) {
    // Catch any error that occurs during the login process
    console.log(error);

    // Send a generic error response if something goes wrong
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate("firm");
    res.json(vendors);
  } catch (error) {
    console.log(error);

    // Send a generic error response if something goes wrong
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getVendorById = async (req, res) => {
  const vendorId = req.params.apple;
  try {
    const vendor = await Vendor.findById(vendorId).populate("firm");
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.status(200).json({ vendor });
  } catch (error) {
    console.log(error);

    // Send a generic error response if something goes wrong
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Export the functions to be used in other parts of the application
module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById };
