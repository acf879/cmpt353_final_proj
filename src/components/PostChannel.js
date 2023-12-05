import React from "react";

async function HandleSubmit(e) {
    var userName;
    var cookie = document.cookie
    cookie.split(";").forEach((item) => {
        if ((item.split("=")[0].split(" ")[1] === "username") || (item.split("=")[0] === "username")) {
            userName = item.split("=")[1];
        }
    });
    e.preventDefault();
    await fetch("http://localhost:9000/users/" + userName + "/channel/", {
        method: "POST", 
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({title: document.getElementById("title").value}),
    }).then((res) => res.json()).then((res) => console.log(res)).catch((err) => {
        console.log(err);
    });
}

function PostChannel() {
    return (<>
    <div className="container text-align">
        <br></br>
        <div className="card my-auto">
            <form onSubmit={HandleSubmit}>
                <div className="form-group">
                    <input type="title" className="form-control" autoFocus={true} maxLength={250} id="title" placeholder="Title of Channel"></input>
                </div>
                <div className="text-center">
                <button className="w-100 btn btn-lg btn-primary" type="submit" value="submit">Submit</button> 
                </div>
            </form>
        </div>
    </div>
</>);
}

export default PostChannel;