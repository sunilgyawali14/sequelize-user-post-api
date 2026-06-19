import Post from "./post.model.js";
import User from "../users/user.model.js";

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "age"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully.",
      data: {
        count: posts.length,
        posts,
      },
    });
  } catch (error) {
    console.error("Get All Posts Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts.",
      error: error.message,
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id, {
      include: [{ model: User, as: "user", attributes: ["id", "name", "email", "age"] }],
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    return res.status(200).json({
      message: "Post fetched successfully.",
      post,
      data: { post },
    });
  } catch (error) {
    console.error("Get Post Error:", error);
    return res.status(500).json({ message: "Failed to fetch post.", error: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user?.id;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required.",
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required to create a post.",
      });
    }

    const newPost = await Post.create({
      title,
      content,
      userId,
    });

    return res.status(201).json({
      message: "Post created successfully.",
      post: newPost,
      data: {
        post: newPost,
      },
    });
  } catch (error) {
    console.error("Create Post Error:", error);

    return res.status(500).json({
      message: "Failed to create post.",
      error: error.message,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.userId !== req.user?.id) {
      return res.status(403).json({ message: "You are not authorized to update this post." });
    }

    await post.update({ title, content });

    return res.status(200).json({
      message: "Post updated successfully.",
      post,
      data: { post },
    });
  } catch (error) {
    console.error("Update Post Error:", error);
    return res.status(500).json({ message: "Failed to update post.", error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.userId !== req.user?.id) {
      return res.status(403).json({ message: "You are not authorized to delete this post." });
    }

    await post.destroy();

    return res.status(200).json({
      message: "Post deleted successfully.",
      data: { id },
    });
  } catch (error) {
    console.error("Delete Post Error:", error);
    return res.status(500).json({ message: "Failed to delete post.", error: error.message });
  }
};

export { createPost, getAllPosts, getPostById, updatePost, deletePost };
