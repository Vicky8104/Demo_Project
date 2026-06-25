import mongoose from "mongoose";


const fileSchema = new mongoose.Schema(
    {
        name: String,
        pdfUrl: String,
    },
    {timestamps:true}
);

const File = mongoose.model("File", fileSchema);
export default File;

// export default mongoose. model ("File", fileSchema);