import React, { useEffect, useState } from "react";
import ChannelTemplate from "./ChannelTemplate";

function Channels() {
    const [getChannels, setChannels] = useState([]);
    let channelsList = [];
    try {
        useEffect(() => {
            var userName;
            var cookie = document.cookie
            cookie.split(";").forEach((item) => {
                if ((item.split("=")[0].split(" ")[1] === "username") || (item.split("=")[0] === "username")) {
                    userName = item.split("=")[1];
                }
            });
            const promise = fetch("http://localhost:9000/users/" + userName + "/channels").then(res => res.json()).then(res => setChannels(res));
            window.onload = async() => {
                await promise;
            }
        }, []);
        for (var key in getChannels['channels']) {
            channelsList.push(<ChannelTemplate title={getChannels['channels'][key]['title']}/>);
     }
    } catch (err) {
        console.log(err);
    }
    return (<>
    <h2> 
        Channels
    </h2>
        <div className="list-group">{channelsList}</div>
</>);
}

export default Channels;