import prisma from "../DB/db.config.js";


export const createComment = async (req, res) => {
    try {
      const { user_id, post_id, comment } = req.body;
  
      if (!user_id || !post_id || !comment) {
        return res.status(400).json({
          status: 400,
          message: "Some parameter is missing. Required UserId, PostId and Comment",
        });
      }

      const existingUser = await prisma.user.findUnique({
        where: {
            id: Number(user_id),
        },
      });
  
      if (!existingUser) {
        return res.status(400).json({
          status: 400,
          message: `User with id ${user_id} does not exist.`,
        });
      }

      const existingPost = await prisma.post.findUnique({
        where: {
          id: Number(post_id),
        },
      });
  
      if (!existingPost) {
        return res.status(404).json({
          status: 404,
          message: `Post with id ${post_id} does not exist.`,
        });
      }
  
      const newComment = await prisma.comment.create({
        data: {
          user_id: Number(user_id),
          post_id: Number(post_id),
          comment,
        },
      });
      await prisma.post.update({
        where:{
          id:Number(post_id)
        },data:{
          comment_count: {
            increment: 1
          }
        }
      })
  
      return res.status(200).json({
        status: 200,
        data: newComment,
        message: "Comment created successfully!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, message: "Internal Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  };
  



export const getCommentById = async (req, res) => {
  try {
    const comment_id = req.params.id;

    const findComment = await prisma.comment.findUnique({
      where: {
        id: Number(comment_id),
      },
    });
    return res.json({
      status: 200,
      findComment,
    });
  } catch (error) {
    console.error(error);
    return res.json({ status: 500, message: error });
  } finally {
    await prisma.$disconnect();
  }
};
export const fetchAllComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({});
    return res.json({
      status: 200,
      data: comments,
    });
  } catch (error) {
    console.error(error);
    return res.json({ status: 500, message: error });
  } finally {
    await prisma.$disconnect();
  }
};

export const updateComment =async (req, res) =>{
    const commentId= req.params.id
    const {comment } = req.body

    await prisma.comment.update({
        where:{
            id:commentId
        },data:{
            comment
        }
    })
    return res.json({
        status:200,
        message:"Post updated Successfully!"
    })
}

export const deleteComment = async (req, res) => {
  try {
    const comment_id = req.params.id;
    //const {name, email, password} = req.body

    await prisma.comment.delete({
      where: {
        id: Number(comment_id),
      },
    });
    return res.json({
      status: 200,
      message: "Comment Deleted Successfully!",
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