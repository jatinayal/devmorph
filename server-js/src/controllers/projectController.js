import User from "../models/User.js";
import WebsiteProject from "../models/WebsiteProject.js";
import openai from "../config/openai.js";
import { GoogleGenAI } from '@google/genai'
import "dotenv/config";

export const makeRevision = async (req, res) => {
  const userId = req.userId;

  try {
    const { projectId } = req.params;
    const { message } = req.body;


    // -------------------------
    // Auth & validation
    // -------------------------
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!message || message.trim() === "") {
      return res
        .status(400)
        .json({ message: "Please enter a valid prompt" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.credits < 5) {
      return res
        .status(403)
        .json({ message: "Add more credits to make changes" });
    }

    const project = await WebsiteProject.findOne({
      _id: projectId,
      userId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // -------------------------
    // Save user message
    // -------------------------
    project.conversations.push({
      role: "user",
      content: message,
    });

    // Deduct credits immediately
    // user.credits -= 5;
    // await user.save();

    await project.save();

    // -------------------------
    // Enhance prompt
    // -------------------------

    const ai = new GoogleGenAI({ apiKey: process.env.GEMNI });

    async function generateAIResponse(prompt) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ],
        });

        return response.text?.trim() || null;
      } catch (error) {
        console.error("Gemini AI error:", error.message);
        return null;
      }
    }


    const prompt = `You are a prompt enhancement specialist. The user wants to make changes to their website.

Enhance the request by:
1. Being specific about elements to change
2. Mentioning design details (colors, spacing, sizes)
3. Clarifying the desired outcome
4. Using clear technical language

user request = ${message}
Return ONLY the enhanced request (2–3 sentences).`;

    const enhanceResponse = await generateAIResponse(prompt);
    const enhancedPrompt = enhanceResponse || message;

    project.conversations.push(
      {
        role: "assistant",
        content: `I've enhanced your prompt to: "${enhancedPrompt}"`,
      },
      {
        role: "assistant",
        content: "Now making changes to your website...",
      }
    );

    await project.save();

    return res.status(201).json({
      success: true,
      enhanceResponse,
      project: project,
      message: 'Enhanced prompt successfully',
    });
  } catch (error) {
    console.error(error);

    // Refund credits if anything fails
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $inc: { credits: 5 },
      });
    }

    res.status(500).json({
      message: error.message || "Failed to apply revision",
    });
  }
};

export const makeRevisionCode = async (req, res) => {
  const userId = req.userId;

  try {
    const { enhanceResponse, projectId } = req.body;

    // -------------------------
    // Auth & validation
    // -------------------------
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.credits < 5) {
      return res
        .status(403)
        .json({ message: "Add more credits to make changes" });
    }

    const project = await WebsiteProject.findOne({
      _id: projectId,
      userId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    user.credits -= 5;
    await user.save();

    const enhancedPrompt = enhanceResponse

    if (!enhancedPrompt) {
      throw new Error("Prompt enhancement failed");
    }
    // -------------------------
    // Generate updated website code
    // -------------------------
    const generationResponse = await openai.chat.completions.create({
      model: "nvidia/nemotron-3-ultra-550b-a55b:free",
      messages: [
        {
          role: "system",
          content: `You are an expert web developer.

CRITICAL REQUIREMENTS:
- Return ONLY the complete updated HTML
- Use Tailwind CSS for ALL styling
- No custom CSS
- Include JS inside <script> before </body>
- Don't use background image property for images just add img tag with src
- Use target="_blank" only for external links (e.g., LinkedIn, GitHub, websites outside the page), and keep internal anchor links like #contact, #about, or same-page navigation opening in the same tab.
- Must be a complete standalone HTML document
- NO explanations, NO markdown`
        },
        {
          role: "user",
          content: `Here is the current website code:\n${project.current_code}\n\nApply this change:\n${enhancedPrompt}`
        }
      ],
      reasoning: { enabled: true }
    });

    let updatedCode = generationResponse?.choices?.[0]?.message?.content;

    if (!updatedCode) {
      throw new Error("Code generation failed");
    }

    // Clean AI code fences
    updatedCode = updatedCode
      .replace(/```[a-z]*\n?/gi, "")
      .replace(/```$/g, "")
      .trim();

    // -------------------------
    // Save new version
    // -------------------------
    project.versions.push({
      code: updatedCode,
      description: "Revision applied",
    });

    const latestVersion =
      project.versions[project.versions.length - 1];

    project.current_code = updatedCode;
    project.current_version_index = latestVersion._id.toString();

    project.conversations.push({
      role: "assistant",
      content:
        "I've made the changes to your website! You can now preview it.",
    });

    await project.save();

    // -------------------------
    // Response
    // -------------------------
    res.json({
      success: true,
      project,
      message: "Changes made successfully"
    });
  } catch (error) {
    console.error(error);

    // Refund credits if anything fails
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $inc: { credits: 5 },
      });
    }

    res.status(500).json({
      message: error.message || "Failed to apply revision",
    });
  }
};

export const rollbackToVersion = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { projectId, versionId } = req.body;

    if (!projectId || !versionId) {
      return res
        .status(400)
        .json({ message: "projectId and versionId are required" });
    }

    const project = await WebsiteProject.findOne({
      _id: projectId,
      userId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const version = project.versions.find(
      (v) => v._id.toString() === versionId
    );

    if (!version) {
      return res.status(404).json({ message: "Version not found" });
    }

    // Roll back to selected version
    project.current_code = version.code;
    project.current_version_index = version._id.toString();

    project.conversations.push({
      role: "assistant",
      content:
        "I've rolled back your website to the selected version. You can now preview it.",
    });

    await project.save();

    res.json({
      message: "Version rolled back successfully",
      project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Failed to rollback version",
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const project = await WebsiteProject.findOneAndDelete({
      _id: projectId,
      userId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Failed to delete project",
    });
  }
};

export const getProjectPreview = async (req, res) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const project = await WebsiteProject.findOne({
      _id: projectId,
      userId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ project });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Failed to fetch project preview",
    });
  }
};

export const getPublishedProjects = async (req, res) => {
  try {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      WebsiteProject.find({ isPublished: true })
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
    ]);

    res.json({
      projects,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalProjects: total,
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Failed to fetch published projects",
    });
  }
};

export const saveProjectCode = async (req, res) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;
    const { code } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!code || !code.trim()) {
      return res.status(400).json({ message: "Code is required" });
    }

    const project = await WebsiteProject.findOne({
      _id: projectId,
      userId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.current_code = code;
    project.current_version_index = "";

    await project.save();

    res.json({ message: "Project saved successfully", project });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Failed to save project",
    });
  }
};

export const getPublishedProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await WebsiteProject.findOne({
      _id: projectId,
      isPublished: true,
      current_code: { $ne: "" }
    }).populate("userId", "name");


    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({
      project: {
        id: project._id,
        name: project.name,
        code: project.current_code,
        creator: project.userId?.name || "Anonymous",
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Failed to fetch published project"
    });
  }
};