import mongoose from "mongoose";


mongoose.set("strictQuery", false);


const uri = "mongodb+srv://marcusbrudev:IhD4dxVt6lJJECr5@cluster0.8p6qfnx.mongodb.net/?appName=Cluster0";

export const connectDB = async ()=>{
    try{
        await mongoose.connect(uri);
        console.log("Database connected");  
    }catch(error){
        console.log("Error connecting to database", error);
    }
   
} 

