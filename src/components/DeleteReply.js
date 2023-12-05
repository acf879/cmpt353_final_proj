function DeleteReply({ channelName, postID, ReplyID}) {
    function deleteReply() {
        var cookie = document.cookie;
        var userName;
        cookie.split(";").forEach((item) => {
            if ((item.split("=")[0].split(" ")[1] === "username") || (item.split("=")[0] === "username")) {
                userName = item.split("=")[1];
            }
        });
        if (userName === "admin") {
            fetch("http://localhost:9000/deleteReply/" + channelName + "/" + postID + "/" + ReplyID, {
                method: "UPDATE",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((res) => {
                // if ((res.status === 200) && (res.statusText === "OK")) {
                //     window.location.href = "/channels/" + channelName + "/message/" + postID + "/replies";
                // }
            });
        }
    }
    return (<>
    <button className="btn btn-danger" type="button" onClick={deleteReply}>Delete</button>
    </>);
}

export default DeleteReply;