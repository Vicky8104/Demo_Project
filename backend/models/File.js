// import mongoose from "mongoose";


// const fileSchema = new mongoose.Schema(
//     {
//         name: String,
//         pdfUrl: String,
//     },
//     {timestamps:true}
// );

// const File = mongoose.model("File", fileSchema);
// export default File;

// // export default mongoose. model ("File", fileSchema);

import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("File", fileSchema);