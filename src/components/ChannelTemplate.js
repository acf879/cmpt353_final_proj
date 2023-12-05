import React, { useEffect } from "react";
import DeleteButton from "./DeleteButton";

var userScraped = false;
var isAdmin = false;
function ChannelTemplate({title}) {
    var userName;
    var cookie = document.cookie
    var channels = [];
    if (!userScraped) {
    cookie.split(";").forEach((item) => {
        if ((item.split("=")[0].split(" ")[1] === "username") || (item.split("=")[0] === "username")) {
            userName = item.split("=")[1];
        }
    });
    userScraped = true;
    }
    if (userName === "admin") {
        isAdmin = true;
    }


return(<>

<li className="list-group-item"><a className="d-inline-flex focus-ring py-1 px-2 text-decoration-none border rounded-2" href={"/channels/" + title + "/message/"}>{title}</a>{isAdmin ? <DeleteButton channelName={title}/>: null}</li>
</>);
}
export default ChannelTemplate;