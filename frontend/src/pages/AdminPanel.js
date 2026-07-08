import React, { useEffect, useState} from "react";
import  API from  "../api/axios";
import Loader from "../components/Loader";


const AdminPanel = ()=>{
    const [file, setFile] = useState(null);
    const [name, setName] = useState("");
    const [files, setFiles] =useState([]);
     const [loading, setLoading] = useState(false);

    useEffect (()=>{
        fetchFiles();
    },[]);

    const fetchFiles = async ()=>{
        // const res = await axios.get("http://localhost:5000/api/files");
        const res = await API.get("/files");
        setFiles(res.data);
    };

    const handleUpload = async ()=>{
         setLoading(true);
        
        if(!name||!file){
            return alert ("Enter file name & select file");
        }
        const formData = new FormData();
        formData.append("file",file);
        formData.append("name", name);

        // await axios.post("http://localhost:5000/api/files/upload",
        //     formData
        // );

        await API.post("/files/upload",
            formData
        );
        setLoading(false);
        alert("Uploaded");
        setFile(null);
        setName("");
        fetchFiles();
    };


    const handleDelete = async (id)=>{
        // await axios.delete(`http://localhost:5000/api/files/${id}`);
        await API.delete(`/files/${id}`);
        fetchFiles();
    };

    return(
        <>
         {loading && <Loader />}
        <div style={{padding:20}}>
            <h2>Admin Upload Panel</h2>
            <input 
                type="text"
                placeholder="File Name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
            />
            <input
                type="file"
                accept="application/pdf"
                onChange={(e)=>setFile(e.target.files[0])}
            />
            <button onClick={handleUpload}>Upload</button>

            <hr />

            <table border="1" width="100%" cellPadding="10">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Delete</th>
                    </tr>
                </thead>

                <tbody>
                    {files.map((f)=>(
                        <tr key={f._id}>
                            <td>{f.name}</td>
                            <td>
                                {new Date(f.createdAt).toLocaleDateString()}
                            </td>
                            <td>
                                <button onClick={()=>handleDelete(f._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
        </>
    );
};

export default AdminPanel;
