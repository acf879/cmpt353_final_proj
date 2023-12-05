import React, { useEffect, useState } from "react";
import ReplyForm from "./ReplyForm";
import NoProfilePic from "./NoProfilePic.jpg";
import DeleteReply from "./DeleteReply";

const Reply = ({ channelID, postID, replyID, userName, body, date, parentID, file}) => {
    var likes = {'post': {'users': [], "post_name": postID, "channel_name": channelID, "replyID": replyID}};
    var dislikes = {'post': {'users': [], "post_name": postID, "channel_name": channelID, "replyID": replyID}};
    var isAdmin = false;
    const [getReply, setReply] = useState(false);
    const [file_, setFile] = useState(null);
    var isFirstRender = true;
    var likes = {'users': []};
    var dislikes = {'users': []};
    var url = "";
    const clicked = e => {
        setReply(true);
    };
    const cancelled = e => {
        setReply(false);
    }

    function liked() {
        try {
            if (likes['post']['users'].indexOf( userName) === -1) {
                likes['post']['users'].push( userName);
                let index = dislikes['post']['users'].indexOf( userName);
                if (index > -1) {
                    dislikes['post']['users'] = dislikes['post']['users'].splice(index, 1);
                }
            }

        } catch (err) {
        }
        fetch ("http://localhost:9000/users/" + userName + "/channel/" + channelID + "/message/" + postID + "/reply/" + replyID + "/ratings", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "likes": likes,
                "dislikes": dislikes
            })
        }).then(res => res.json()).then(res => console.log(res));
        
        console.log({'likes': likes, 'dislikes': dislikes});
    }
    function disliked() {

        try {
            if (dislikes['post']['users'].indexOf( userName) === -1) {
                dislikes['post']['users'].push( userName);
                var index = likes['post']['users'].indexOf( userName);
                if (index > -1) {
                    likes['post']['users'] = likes['post']['users'].splice(index, 1);
                }
            }
            
        } catch (err) {
        }
        fetch ("http://localhost:9000/users/" + userName + "/channel/" + channelID + "/message/" + postID + "/reply/" + replyID + "/ratings", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "likes": likes,
                "dislikes": dislikes
            })
        }).then(res => res.json()).then(res => console.log(res));
        
        console.log({'likes': likes, 'dislikes': dislikes});
    }
    if (userName === "admin") {
        isAdmin = true;
    }
    return (
        <>
        <div className="">
        <br></br>
        <div className="" >

        <ul className="nav"><li className="nav-item"><a className="nav-link disabled"><img src={NoProfilePic} width="40" height="$0" alt=""></img></a></li><li className="nav-item"><a className="nav-link disabled">{userName}</a></li><li className="nav-item"><a className='nav-link disabled'>{date}</a></li></ul>
            <div>
            <img src={url}/>
                <p>{body}</p>
            </div>
            <button className="btn" type="button" onClick={liked}>Like</button>
            <button className="btn" type="button" onClick={disliked}>Dislike</button>
            <div className="mt-1 ml-3">
            <button className="btn" type="submit" value="submit" onClick={clicked}>Reply</button> {getReply && (<div><ReplyForm replyID_={replyID} /><button className="btn" type="submit" value="submit" onClick={cancelled}>Cancel</button></div>
            )}
            </div>
            {isAdmin ? <DeleteReply channelName={channelID} postID={postID} ReplyID={replyID}/>: null}
        </div>
        </div>
        </>)
}

export default Reply;
