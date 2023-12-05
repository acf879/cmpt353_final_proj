import React, { useState } from 'react';

const channelName = window.location.href.split("/")[4];

function PostMessage(props) {
    const [file, setFile] = useState({fileName: "", file: []});
    const HandleChange = (e) => {
        setFile({fileName: e.target.files[0]['type'], file: URL.createObjectURL(e.target.files[0])});
    }

    const functionHandler = (e) => {
        e['title'] = document.getElementById("titlePost").value;
        props.passChildData(e);
    }
    
const HandleSubmit = (e) => {
    e.preventDefault();
    var userName;
    var cookie = document.cookie
    cookie.split(";").forEach((item) => {
        if ((item.split("=")[0].split(" ")[1] === "username") || (item.split("=")[0] === "username")) {
            userName = item.split("=")[1];
        }
    });
    var url = "http://localhost:9000/users/" + userName + "/channel/" + channelName + "/message/";
    fetch(url, {
        method: "POST", 
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({'title': document.getElementById("titlePost").value, 'body': document.getElementById("message").value, 'file': file}),
    }).then((res) => res.json()).then((res)=>(functionHandler(res))).catch((err) => {
        console.log(err);
    });
}

    return (
        <>
        <div className="container text-align">
        <br></br>
        <div className="card my-auto">
        <form onSubmit={HandleSubmit}>
        <div className="form-group">
            <input type="title" className="form-control" autoFocus={true} maxLength={128} id="titlePost" placeholder="Title of Post"></input>
        </div>
        <input type="file" onChange={HandleChange} accept=".jpeg, .png, .jpg, .JPEG, .PNG, .JPG"/>
            <img src={file['file']} />
        <div className="form-group">
            <textarea style={{resize: 'none'}} maxLength={250} placeholder="Post your description here" rows="4" cols="50" className="form-control" id="message"></textarea>
        </div>
        <div className="text-center">
        <button className="w-100 btn btn-lg btn-primary" type="submit" value="submit">Submit</button> 
        </div>
        </form>
        </div>
        </div>
        </>
    );
}
export default PostMessage;