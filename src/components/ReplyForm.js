import React, { useState } from "react";

var replyID_;



const ReplyForm = ({replyID_}) => {
    const [file, setFile] = useState(null);
    const [rawFile, setRawFile] = useState(null);
    function setReplyID(replyID__) {
        replyID_ = replyID__;
    }
    
     async function Click(e) {
        var userName;
        var cookie = document.cookie
        cookie.split(";").forEach((item) => {
            if (item.split("=")[0].split(" ")[1] === "username") {
                userName = item.split("=")[1];
            }
        });
        var channelName = window.location.href.split("/")[4];
        const message = window.location.href.split("/")[6];
    
        try {
        await fetch("http://localhost:9000/users/" + userName + "/channel/" + channelName +"/message/" + message +'/reply/' + replyID_ + "/", {
            method: "POST", 
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "reply": document.getElementById(replyID_ +"").value,
                "file": file
            })
        }).then(res => res.json()).then(res => console.log(res));
    } catch (err) {
    }
    }


    const HandleChange = (e) => {
        setFile(URL.createObjectURL(e.target.files[0]));
        setRawFile(e.target.files[0]);
        console.log(e.target.files[0]);
        
    }

    return (
        <>
        <div className="reply-form">
        <div className="card my-auto">
        <form>
            <div className="form-group">
            <label htmlFor="reply">Reply</label>
            <br></br>
            <input type="file" maxFileSize onChange={HandleChange}/>
            <img src={file} />
            <textarea className="form-control"  maxLength={250} autoFocus={true} id={replyID_ +""} rows="3"></textarea>
            </div>
        </form>
        </div>
        </div>
        <button type="submit" className="btn" onClick={() => {
            setReplyID(replyID_ +"");
            Click();
        }
        }>Submit</button>
        </>)
}

export default ReplyForm;