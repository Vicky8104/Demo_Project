import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log (`MongoDB connect: ${conn.connection.host} `);
    }catch(error){
        console.log("DB Error :", error.message)
        process.exit(1);
    }
};
// module.exports = connectDB;
export default connectDB;
