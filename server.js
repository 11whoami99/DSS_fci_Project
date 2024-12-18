const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://0.0.0.0:27017/", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB now is connected"))
  .catch((err) => console.error("Failed to connect to DB:", err));

// Schemas
//Users Schema 
const userSchema = new mongoose.Schema({
    name: { type: String, default: 'Default Name' },
    email: { type: String, default: 'default@example.com' },
    username: { type: String, default: 'defaultUsername' },
    password: { type: String, default: 'defaultPassword' },
    age: { type: Number, default: 30 },
    phone: { type: String, default: '+1234567890' },
    nationality: { type: String, default: 'Default Nationality' },
  });

// Blog Schema
const blogSchema = new mongoose.Schema({
    authorId: { type: Number, default: 0 },
    title: { type: String, default: 'Default Blog Title' },
    content: { type: String, default: 'Default blog content.' },
    createdDate: { type: Date, default: Date.now },
  });
  
  // HotelRating Schema
  const hotelRatingSchema = new mongoose.Schema({
    name: { type: String, default: 'Default Hotel Name' },
    rating: { type: Number, default: 3 },
    country: { type: String, default: 'Default Country' },
    comments: { type: String, default: 'Default comments.' },
  });

// Models
const UserModel = mongoose.model("User", userSchema);
const BlogModel = mongoose.model("Blog", blogSchema);
const RatingModel = mongoose.model("HotelRating", hotelRatingSchema);

// Insert default data (optional initialization)
(async () => {
  await new UserModel({
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    username: "mariag22",
    password: "hashedpassword456",
    age: 28,
    phone: "+34123456789",
    nationality: "Spanish",
  }).save();

  await new BlogModel({
    authorId: 12,
    title: "My experience in Paris",
    content: "My trip to Paris was nothing short of magical!",
  }).save();

  await new RatingModel({
    name: "Grand Paris Hotel",
    rating: 4.7,
    country: "France",
    comments: "Wonderful experience! The staff was friendly, and the rooms were spacious and clean.",
  }).save();
})();

// Endpoints

// Get all entities
app.get("/users", async (req, res) => {
  const users = await UserModel.find();
  res.status(200).json(users);
});

app.get("/blogs", async (req, res) => {
  const blogs = await BlogModel.find();
  res.status(200).json(blogs);
});

app.get("/hotelRatings", async (req, res) => {
  const ratings = await RatingModel.find();
  res.status(200).json(ratings);
});

// Get a single entity by ID
app.get("/users/:id", async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json(user);
});

app.get("/blogs/:id", async (req, res) => {
  const blog = await BlogModel.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  res.status(200).json(blog);
});

app.get("/hotelRatings/:id", async (req, res) => {
  const rating = await RatingModel.findById(req.params.id);
  if (!rating) return res.status(404).json({ message: "Rating not found" });
  res.status(200).json(rating);
});

// Create entities
app.post("/users", async (req, res) => {
  try {
    const newUser = new UserModel(req.body);
    const savedUser = await newUser.save();
    res.status(201).json({ message: "User created", user: savedUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

app.post("/blogs", async (req, res) => {
  try {
    const newBlog = new BlogModel(req.body);
    const savedBlog = await newBlog.save();
    res.status(201).json({ message: "Blog created", blog: savedBlog });
  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error });
  }
});

app.post("/hotelRatings", async (req, res) => {
  try {
    const newRating = new RatingModel(req.body);
    const savedRating = await newRating.save();
    res.status(201).json({ message: "Rating created", rating: savedRating });
  } catch (error) {
    res.status(500).json({ message: "Error creating rating", error });
  }
});

// Update entities
app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
});

// Update Blog
app.put("/blogs/:id", async (req, res) => {
    try {
      const updatedBlog = await BlogModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedBlog) return res.status(404).json({ message: "Blog not found" });
      res.status(200).json(updatedBlog);
    } catch (error) {
      res.status(500).json({ message: "Error updating blog", error });
    }
  });
  
  // Update Hotel Rating
  app.put("/hotelRatings/:id", async (req, res) => {
    try {
      const updatedRating = await RatingModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedRating) return res.status(404).json({ message: "Rating not found" });
      res.status(200).json(updatedRating);
    } catch (error) {
      res.status(500).json({ message: "Error updating rating", error });
    }
  });
  

// Delete entities
app.delete("/users/:id", async (req, res) => {
  const result = await UserModel.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ message: "User deleted" });
});

// Delete Blog
app.delete("/blogs/:id", async (req, res) => {
    const result = await BlogModel.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ message: "Blog deleted" });
  });
  
  // Delete Hotel Rating
  app.delete("/hotelRatings/:id", async (req, res) => {
    const result = await RatingModel.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Rating not found" });
    res.status(200).json({ message: "Rating deleted" });
  });
  
// Start the server
app.listen(3000, () => console.log("Server now is opened"));
