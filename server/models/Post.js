import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    text: { type: String, maxlength: 280, trim: true, default: "" },
    imageUrl: { type: String, default: "" },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.pre("validate", function () {
  if (!this.text && !this.imageUrl) {
    throw new Error("El post debe tener texto o imagen");
  }
});

postSchema.index({ createdAt: -1 });

export default mongoose.model("Post", postSchema);