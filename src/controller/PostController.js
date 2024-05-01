import prisma from "../DB/db.config.js";

export const getPosts = async (req, res) => {
  try {
    const { search, page, limit, field, sortOrder } = req.query;
    let offset = (+page - 1) * +limit;
    
    let where = {};
    if (search) {
      const searchWords = search.trim().split(/\s+/);
      where = {
        OR: searchWords.map(word => ({
          title: { contains: word },
        })),
      };
    }

    const posts = await prisma.post.findMany({
      skip: offset || 0,
      take: +limit || 10,
      orderBy: {
        [field || 'id']: sortOrder || 'asc',
      },
      where,
    });
    
    return res.json({
      status: 200,
      data: posts,
    });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    return res.status(500).json({
      status: 500,
      error: "Internal Server Error",
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const createPost = async (req, res) => {
  try {
    const { user_id, title, description } = req.body;


    if (!user_id || !title || !description) {
        return res.status(400).json({
          status: 400,
          message: "Some parameter is missing. Required UserId, Title and Description",
        });
      }

    const newPost = await prisma.post.create({
      data: {
        user_id: Number(user_id),
        title: title,
        description: description,
      },
    });
    return res.status(201).json({
      status: 201,
      data: newPost,
      message: "Post created successfully !",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: error });
  } finally {
    await prisma.$disconnect();
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    const findPost = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    return res.json({
      status: 200,
      findPost,
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).json({
      status: 500,
      error: "Internal Server Error",
    });
  } finally {
    await prisma.$disconnect();
  }
};
export const fetchAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({});
    return res.json({
      status: 200,
      data: posts,
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).json({
      status: 500,
      error: "Internal Server Error",
    });
  } finally {
    await prisma.$disconnect();
  }
};


export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });
    return res.json({
      status: 200,
      message: "Post Deleted Successfully!",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
      if (error.code === 'P2025') { 
        const postId = req.params.id;
        return res.status(404).json({
          status: 404,
          error: `Post not found with id ${postId}.`,
        });
      } else {
        return res.status(500).json({
          status: 500,
          error: "Internal Server Error",
        });
      }
    } finally {
      await prisma.$disconnect();
    }
};