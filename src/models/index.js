import sequelize from "../config/connection.js";
import User from "../features/users/user.model.js";
import Post from "../features/post/post.model.js";

User.hasMany(Post, { foreignKey: "userId", as: "posts" });
Post.belongsTo(User, { foreignKey: "userId", as: "user" });

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    await sequelize.sync({ alter: true });
    console.log("Database synchronized successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};

export { sequelize, connectDB, User, Post };