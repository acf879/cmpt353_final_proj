import GetMessage from "./GetMessage";
try{ 
var channelName = window.location.href.split("/")[4].split("%20").join(" ");
} catch (err) {
    var channelName = "";
}
function ChannelPage() { // channelName is passed in from Channel.js
    return (<>
    <h2 className="text-center">{channelName}</h2>
    <div><GetMessage/></div>
    </>);
}

export default ChannelPage;