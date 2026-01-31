import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WebsiteProject",
      required: true,
      index: true,
    }
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ projectId: 1, createdAt: -1 });

export default mongoose.model("Comment", commentSchema);