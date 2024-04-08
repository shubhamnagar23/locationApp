const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const requestIp = require("request-ip");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/locationDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Location schema
const locationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  url: String,
  ipAddress: String, // Add a new field for IP address
});

// Location model
const Location = mongoose.model("Location", locationSchema);

// Route to save location
app.post("/api/location", async (req, res) => {
  const { latitude, longitude, url } = req.body;
  const ipAddress = requestIp.getClientIp(req); // Fetch IP address from request
  const location = new Location({
    latitude,
    longitude,
    url,
    ipAddress, // Save IP address along with location data
  });
  await location.save();
  res.json({ message: "Location saved successfully" });
});

app.get("/", (req, res) => {
  app.use(express.static(path.resolve(__dirname, "client", "dist")));
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
