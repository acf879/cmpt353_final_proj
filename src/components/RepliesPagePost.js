import React from 'react';

function RepliesPagePost({channelID, title, body, userName, date}) {return (
    <>
        <h5 className="ms-2">{userName}    {title}   {date}</h5>
            <p>{body}</p>
        <br></br><br></br>
    </>
);
}

export default RepliesPagePost;