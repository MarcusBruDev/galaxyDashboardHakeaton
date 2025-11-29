import { createContext , useState, useEffect,useContext} from "react";
import {getPlanetsRequest} from '../api/planet'



const PlanetContext = createContext();

export const usePlanet = ()=>{
    const context = useContext(PlanetContext);
    if(!context) throw new Error("There is no AuthProvider");
    return context;
}


export  const PlanetProvider =({children})=>{

    const [marsData, setMarsData]= useState([])
   


    const newPlanet =async  (task)=>{
        try{
            const res =  await createNewTaskRequest(task)
           setTasks(prev => [...prev,res.data.task]); // AGREGA en vez de reemplazar
            setMessage("Tarea creada correctamente ✔️");
                 // ocultar mensaje después de 3s
             setTimeout(() => setMessage(""), 2000);

            return res; // opcional, útil para navegación
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const deletePlanet = async (id)=>{
        try{
            const res = await deleteTaskRequest(id)
                // Quitar la tarea localmente sin recargar
            setTasks(prev => prev.filter(t => t._id !== id));

            // Mensaje de éxito
            setMessage("Tarea eliminada correctamente ✔️");
                 // ocultar mensaje después de 3s
             setTimeout(() => setMessage(""), 2000);
            
        }catch(error){
                console.log(error);
        }
    }


    const UpdatePLanet = async (id,task)=>{
        try{
            const res = await updateTaskRequest(id,task)
      
            setTasks(prev => prev.map(t=> t._id === id ? { ...t, tittle: task.tittle, description: task.description } : t))
            console.log(res)
        }catch(error){
            console.log(error)
        }
    }

    /*const getTask = async (id)=>{
        try{
            const res = await getTaskRequest(id)
            return res.data
        }catch(error){
             console.log(error)
        }
    }*/


    useEffect(()=>{
            async function getPlanets(){
                    try{
                        const res = await getPlanetsRequest();
                        console.log(res)
                        setMarsData([...res.data]);
                      
                    }catch(error){
                        console.log(error);
                    }
            }
            getPlanets();     
    },[])



    return (
        <TaskContext.Provider 
        value={{     
        marsData,
        }
        }>
            {children}
        </TaskContext.Provider>
    )

}