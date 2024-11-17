const Firm = require("../models/Firm");

const Vendor = require("../models/Vendor");

const multer = require("multer");

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

const addFirm = async (req, res) => {
  try {
    const { firmName, area, category, region, offer } = req.body;

    const image = req.file ? req.file.filename : undefined;

    const vendor = await Vendor.findById(req.vendorId);

    if (!vendor) {
      res.status(400).json({ message: "Vendor Not Found" });
    }

    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image,
      vendor: vendor._id,
    });

    const savedFirm = await firm.save();
    vendor.firm.push(savedFirm);

    await vendor.save();

    return res.status(200).json({ message: "Firm Added Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal sever error");
  }
};

const deleteFirmById = async (req, res) => {
  try {
    const firmId = req.params.firmId;

    const deletedFirm = await Firm.findByIdAndDelete(firmId);

    if (!deletedFirm) {
      return res.status(404).json({ error: "No Firm Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { addFirm: [upload.single("image"), addFirm], deleteFirmById };
