import Planet from "../models/planet.model.js"

export const getPlanet= async (req,res)=>{
   const task=[1,2]
    res.json(task)
}



export const createPlanet= async  (req,res)=>{
        const {name,description }= req.body;

        const newPLanet = new Planet({
            name: name,
            description: description,
        })
        const savedPLanet = await newPLanet.save();
        res.json({message: 'Task created', savedPLanet: savedPLanet})
        
}
