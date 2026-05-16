const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Project description is required"],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: [
        "Planning",
        "Active",
        "Completed",
      ],
      default: "Planning",
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model(
  "Project",
  projectSchema
);

module.exports = Project;