import React, {useEffect, useState} from 'react';
import DeleteMessages from './DeleteMessages';
function PreviousMessage({channelName, post_title, body, userNames, date, fileName, file}) {
    var isAdmin = false;
    const blob = new Blob([file], {type: fileName});
    const image = URL.createObjectURL(blob);
    var likes = {'post': {'users': [], "post_name": post_title, "channel_name": channelName}};
    var dislikes = {'post': {'users': [], "post_name": post_title, "channel_name": channelName}};
    const [src, setSrc] = useState("");
    useEffect(() => {
        const blob = new Blob([file], {type: fileName});
        const image = URL.createObjectURL(blob);
        setSrc(image);
    }, []);
    function liked() {
        try {
            if (likes['post']['users'].indexOf(userNames) === -1) {
                likes['post']['users'].push(userNames);
                let index = dislikes['post']['users'].indexOf(userNames);
                if (index > -1) {
                    dislikes['post']['users'] = dislikes['post']['users'].splice(index, 1);
                }
            }

        } catch (err) {
        }
        console.log({'likes': likes, 'dislikes': dislikes});
    }
    function disliked() {

        try {
            if (dislikes['post']['users'].indexOf(userNames) === -1) {
                dislikes['post']['users'].push(userNames);
                var index = likes['post']['users'].indexOf(userNames);
                if (index > -1) {
                    likes['post']['users'] = likes['post']['users'].splice(index, 1);
                }
            }
            
        } catch (err) {
        }
        console.log({'likes': likes, 'dislikes': dislikes});
    }
    if (userNames === "admin") {
        isAdmin = true;
    }
    return (
    <>
        <div className="mx-2">
            <ul className="nav"><li className="nav-item"><a className='nav-link disabled'>{userNames}</a></li><li className="nav-item"><a className="nav-link disabled">{post_title}</a></li><li className="nav-item"><a className='nav-link disabled'>{date}</a></li></ul>
            <img src={src} />
            <button className="btn" type="button" onClick={liked}>Like</button>
            <button className="btn" type="button" onClick={disliked}>Dislike</button>
            <p> {body}</p>
        <a href={"/channels/" + channelName + "/message/" + post_title + "/replies/"} className="btn btn-primary">Replies</a>{isAdmin ? <DeleteMessages channelName={channelName} postID={post_title}/>: null}
        <br></br><br></br>
        </div>
    </>
);
}

export default PreviousMessage;