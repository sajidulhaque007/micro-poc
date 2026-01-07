import express, { Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB (auth_db)
mongoose.connect("mongodb://localhost:27017/auth_db")
  .then(() => console.log("Auth DB Connected"));

// User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", UserSchema);


app.get("/", async (req: Request, res: Response): Promise<any> => {

  return res.json({ message: "Hello from Auth Service!!!!!!!" });
});
// Register Route
app.post("/register", async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();
  return res.json({ message: "User created" });
});

// Login Route
app.post("/login", async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  // Sign Token (Include ID and Email)
  const token = jwt.sign({ id: user._id, email: user.email }, "SECRET_KEY");
  return res.json({ token });
});

app.listen(4001, () => {
  console.log("Auth Service running on 4001");
});