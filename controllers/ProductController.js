const Product = require("../models/Product");
const multer = require("multer");
const Firm = require("../models/Firm");

// Set up multer storage configuration
const storage = multer.diskStorage({
  // Destination where files will be stored
  destination: (req, file, cb) => {
    cb(null, uploadFolder); // Save files to the 'uploads' folder
  },

  // Define the naming convention for the uploaded files
  filename: (req, file, cb) => {
    // Create a unique filename by appending the current timestamp
    cb(null, Date.now() + path.extname(file.originalname)); // Keep the file extension
  },
});

const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
  try {
    const { productName, price, category, bestSeller, description } = req.body;

    const image = req.file ? req.file.filename : undefined;

    const firmId = req.params.firmId;

    const firm = await Firm.findById(firmId);

    if (!firm) {
      return res.status(404).json({ error: "No firm found" });
    }

    const product = new Product({
      productName,
      price,
      category,
      bestSeller,
      description,
      image,
      firm: firm._id,
    });

    const savedProduct = await product.save();

    firm.products.push(savedProduct);

    await firm.save();

    res.status(200).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProductByFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);

    if (!firm) {
      return res.status(404).json({ error: "No firm found" });
    }

    const restaurantName = firm.firmName;

    const products = await Product.find({ firm: firmId });

    res.status(200).json({ restaurantName, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productId;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: "No Product Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addProduct: [(upload.single("image"), addProduct)],
  getProductByFirm,
  deleteProductById,
};
