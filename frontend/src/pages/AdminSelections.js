import { useEffect, useState } from "react";
import API from "../api/axios";
import "./AdminSelections.css";

export default function AdminSelctions(){
    
    const [selections, setSelections]=useState([]);
    const [editSelections, setEditSelections]=useState(null);
    const [viewSelections, setViewSelections]=useState(null);

    const fetchSelections = async()=>{

        try{
            const res = await API.get("/admin/getSelections");

            setSelections(res.data);
        }catch(err){
            console.log(err);
            alert("API Error");
        }
    };

    useEffect (()=>{
        fetchSelections();
    },[]);

    const handleDelete =async (id) =>{

        try{
            if(!window.confirm("Delete this Selection?")) return;
            await API.delete(`/admin/getSelections/${id}`);
            fetchSelections();
        }catch (err){
            console.error(err.response?.data || err.message);
            alert("Delete failed")
        }
    };

    const handleUpdate = async()=>{
        await API.put(`/admin/getSelections/${editSelections._id}`,editSelections);
        setEditSelections(null);
        fetchSelections();
    };

    const columns = [
        "email",
        "post",
        "area",
        "subject",
        "meritNo",
        "rollNo",
        "selCategory",
        "splCategory",
        "mobile",
        "status",
    ];

    const restrictedFields = ["email"];

    return(

        <div className="admin-container">
            <h2>Selection Management</h2>

            <table border="1" cellPadding="10" className="admin-selection-table">
                <thead>
                    <tr>
                        <th>S.No.</th>
                        {columns.map((col)=>(
                            <th key={col}>{col.toUpperCase()}</th>
                        ))}
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                        {selections.map((s,index)=>(
                            <tr key={s._id}>
                                <td>{index+1}</td>
                                {columns.map((col)=>(
                                    <td key={col}>
                                        {typeof s[col] === "object"
                                            ? JSON.stringify(s[col])
                                            :s[col]}
                                    </td>
                                ))}
                                <td>
                                    <button onClick={()=> setViewSelections(s)}>View</button>
                                    <button onClick={()=> setEditSelections(s)}>Update</button>
                                    <button onClick={()=> handleDelete(s._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                </tbody>
                </table>    

                {editSelections && (
                    <div className="admin-selection-modal">
                        <div className="admin-selection-card">
                            <span className="close" onClick={()=>setEditSelections(null)}>
                                ❌
                            </span>
                            <h3>Edit Selection</h3>
                            <div className="admin-selection-card-content">
                            {Object.keys(editSelections)
                            .filter(
                                (key)=>
                                    key !== "_id" &&
                                    key !== "__v" &&
                                    !restrictedFields.includes(key)
                            )
                            .map((key)=>(
                                <div className="row" key={key}>
                                    <label>{key}</label>
                                    <input 
                                        value={editSelections[key] || ""}
                                        onChange={(e)=>
                                            setEditSelections({
                                                ...editSelections,
                                                [key]:e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            ))}
                            </div>

                            <div className="admin-selection-btns">
                                <button onClick={handleUpdate}>Save</button>
                                <button onClick={()=> setEditSelections(null)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
                {viewSelections && (
                    <div className="admin-selection-modal">
                        <div className="admin-selection-card">
                            <span className="close" onClick={()=> setViewSelections(null)}>
                                ❌
                            </span>
                            <h3>Selection Details</h3>

                            <div className="admin-selection-card-content">
                                {Object.keys(viewSelections).map((key)=>(
                                    <div className="row" key={key}>
                                        <b>{key}:</b>
                                        <span>
                                            {typeof viewSelections[key] === "object"
                                                ? JSON.stringify(viewSelections[key])
                                                :viewSelections[key]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            
            </div>
    );
}