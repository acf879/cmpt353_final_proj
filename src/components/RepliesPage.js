import React, { useEffect, useState } from 'react';
import RepliesPagePost from './RepliesPagePost';
import Reply from './Reply';
import ReplyForm from './ReplyForm';

function RepliesPage() {
    
    var userName;
    var cookie = document.cookie
    cookie.split(";").forEach((item) => {
        if ((item.split("=")[0].split(" ")[1] === "username") || (item.split("=")[0] === "username")) {
            userName = item.split("=")[1];
        }
    });
    var channelName = window.location.href.split("/")[4].split("%20").join(" ");
    const message = window.location.href.split("/")[6].split("%20").join(" ");
    var parent_reply = "undefined";

    const [getReplies, setReplies] = useState([]);
    const [getMessage, setMessage] = useState([]);
    let repliesList = [];
    let messageList = [];
    const [post, setPost] = useState("");
    
    try {
        useEffect(() => {
        if (post === "") {
            fetch("http://localhost:9000/users/" + userName + "/channel/" + channelName +"/messages/").then(res => res.json()).then(res => setMessage(res));
            for (let key in getMessage['messages']) {
                if (getMessage['messages'][key]['title'] === message) {
                    setPost(<RepliesPagePost channelID={channelName} title={message} body={getMessage['messages'][key]['body']} userName={getReplies['replies'][key]['user']} date={getMessage['messages'][key]['time']} />);
                }
            }
        }
    }, []);
    } catch (err) {
    }
    try{ 
        useEffect(() => {
            fetch("http://localhost:9000/users/" + userName + "/channel/" + channelName + "/message/" + message + "/replies").then(res => res.json()).then(res => setReplies(res));
        }, []);

    function nestedComments(key, replies, margin, key2, file_) {
            for (var key3 in replies) {
                if (replies[key2]['replyID'] === replies[key3]['parentID']) {
                    repliesList.push(<div style={{marginLeft: margin}}><Reply channelID={channelName} postID={message} replyID={replies[key3]['replyID']} userName={replies[key3]['user']} body={replies[key3]['body']} date={replies[key3]['time']} parentID={replies[key3]['parentID']} file={file_}/></div>);
                    nestedComments(key, replies, margin + 30, key3);
                }
            }
        }

        for (let key in getReplies['replies']) {
            if (getReplies['replies'][key]['parentID'] === null) {
                repliesList.push(<div style={{marginLeft: 10}}><Reply channelID={channelName} postID={message} replyID={getReplies['replies'][key]['replyID']} userName={getReplies['replies'][key]['user']} body={getReplies['replies'][key]['body']} date={getReplies['replies'][key]['time']} parentID={getReplies['replies'][key]['parentID']} file={getReplies['replies'][key]['file']}/></div>); 
                for (var key2 in getReplies['replies']) {
                    if (getReplies['replies'][key2]['parentID'] === getReplies['replies'][key]['replyID']) {
                        repliesList.push(<div style={{marginLeft: 40}}><Reply channelID={channelName} postID={message} replyID={getReplies['replies'][key2]['replyID']} userName={getReplies['replies'][key2]['user']} body={getReplies['replies'][key2]['body']} date={getReplies['replies'][key2]['time']} parentID={getReplies['replies'][key2]['parentID']} file={getReplies['replies'][key2]['file']}/></div>);
                        nestedComments(key, getReplies['replies'], 40, key2, getReplies['replies'][key2]['file']);
                    }
                }
            }
        }
        
    }
    catch (err) {
    }
    
 
     const renderPage = () => {   
        return (
            <div>
            {post}
            <div className="container">
            <ReplyForm/>
            </div>
            <div className="">
            {repliesList}
            </div>
            </div>
        );

    }
    return renderPage();

}

export default RepliesPage;