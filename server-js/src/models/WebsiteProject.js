import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const versionSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },

    code: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);


const websiteProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    initial_prompt: {
      type: String,
      required: true,
    },

    current_code: {
      type: String,
      default: "",
    },

    current_version_index: {
      type: String,
      default: "",
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    conversations: {
      type: [conversationSchema],
      default: [],
    },

    versions: {
      type: [versionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

websiteProjectSchema.index({ userId: 1, updatedAt: -1 });
websiteProjectSchema.index({ isPublished: 1 });

export default mongoose.model("WebsiteProject", websiteProjectSchema);
