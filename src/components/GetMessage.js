import React, { useEffect, useState } from 'react';
import PreviousMessage from './PreviousMessage';
import PostMessage from './PostMessage';

try {
var channelName = window.location.href.split("/")[4].split("%20").join(" ");
} catch (err) {
    var channelName = "";
}
function GetMessage() {
    const [getMessages, setMessages] = useState([]);
    const [childData, setChildData] = useState([]); // this is the channel name
    const file = {fileName: "", file: []};
    let messageList = [];

    var userName;
    var cookie = document.cookie
    cookie.split(";").forEach((item) => {
        if ((item.split("=")[0].split(" ")[1] === "username") || (item.split("=")[0] === "username")) {
            userName = item.split("=")[1];
        }
    });
    try {
        useEffect(() => {
            fetch("http://localhost:9000/users/" + userName + "/channel/" + channelName + "/messages/").then(res => res.json()).then(res => setMessages(res));
        }, [childData]);

     for (var key in getMessages['messages']) {
        messageList.push(<PreviousMessage channelName={channelName} post_title={getMessages['messages'][key]['title']} body={getMessages['messages'][key]['body']} userNames={userName} date={getMessages['messages'][key]['time']} fileName={getMessages['messages'][key]['fileName']} file={getMessages['messages'][key]['file']} />);
     }
    } catch (err) {
        console.log(err);
    }
    return (
    <>
    <PostMessage passChildData={setChildData}/>
    <br></br><br></br>
    <h2 className="text-center">Messages</h2>
    <div>{messageList}</div>
    </>
    );
}

export default GetMessage;