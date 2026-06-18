import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./models/index.js";
import userRoutes from "./features/users/user.routes.js";
import postRoutes from "./features/post/post.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Sequelize User-Post API is running" });
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
