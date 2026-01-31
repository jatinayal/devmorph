import Comment from "../models/comment.js";


export const postComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { projectId } = req.params;
    const userId = req.userId;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    const comment = await Comment.create({
      content: content.trim(),
      userId,
      projectId,
    });

    return res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    console.error("Post comment error:", error);
    return res.status(500).json({
      success: false, 
      message: "Failed to post comment",
    });
  }
};


export const getCommentsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const comments = await Comment.find({
      projectId
    })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.error("Get comments error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
    });
  }
};
