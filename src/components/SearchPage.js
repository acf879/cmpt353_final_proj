import React, { useEffect, useState } from "react";

const SearchPage = () => {
    const search = window.location.href.split("/")[4];
    const [searchList, setSearchList] = useState([]);
    const [searchType, setSearchType] = useState("all");
    const [getSearchListHTML, setSearchListHTML] = useState([]);
    const [sortType, setSortType] = useState("asc");
    try {
        useEffect(() => {
            var userName;
            var cookie = document.cookie
            cookie.split(";").forEach((item) => {
                if ((item.split("=")[0].split(" ")[1] === "username") || (item.split("=")[0] === "username")) {
                    userName = item.split("=")[1];
                }
            });
            const promise = fetch("http://localhost:9000/users/" + userName + "/search/" + search).then(res => res.json()).then(res => setSearchList(res));

        }, []);
    } catch (err) {
        console.log(err);
    }
var searchListHTML = [];
useEffect(() => {
    searchListHTML = [];
        try{
            if ((searchType === "channels") || (searchType === "all")) {
                for (var key in searchList['search']['channels']) {
                    searchListHTML.push(<a href={"/channels/"} className="list-group-item list-group-item-action">{searchList['search']['channels'][key]['title']}</a>);
                }
            }
            } catch (err) {
        }
        try {
            if ((searchType === "post") || (searchType === "all")) {
                for (var key in searchList['search']['posts']) {
                    searchListHTML.push(<a href={"/channels/" + searchList['search']['posts'][key]['channelName'] +"/message/"} className="list-group-item list-group-item-action">{searchList['search']['posts'][key]['title']}</a>);
                }
            }
                } catch (err) {
            }
        
            try {
                if ((searchType === "replies") || (searchType === "all")) {
                for (var key in searchList['search']['replies']) {
                    searchListHTML.push(<a href={"/channels/" + searchList['search']['replies'][key]['channelName'] +"/message/"+searchList['search']['replies'][key]['postID']+"/replies"} className="list-group-item list-group-item-action">{searchList['search']['replies'][key]['body']}</a>);
             }
            }
            } catch (err) {
        }
        setSearchListHTML(searchListHTML);
        if (sortType === "desc") {
            setSearchListHTML(searchListHTML.reverse());
        }
    }, [searchList, searchType, sortType]);

    return (<>
    <h2> 
        Search results
    </h2>
<select defaultValue={'all'} id="filter" onChange={() => {
    var e = document.getElementById("filter");
    var strUser = e.options[e.selectedIndex].value;
    setSearchType(strUser);
}}>
    <option value="all">All</option>
    <option value="channels">Only Channels</option>
    <option value="post">Only Posts</option>
    <option value="replies">Only Replies</option>
</select>
<select defaultValue="asc" id="sort" onChange={() => {
    var e = document.getElementById("sort");
    var strUser = e.options[e.selectedIndex].value;
    setSortType(strUser);

}
}>
    <option value="asc">Ascending</option>
    <option value="desc">Descending</option>
</select>
        <div className="list-group" id="appendHere">
            {getSearchListHTML}
        </div>
    </>);
}

export default SearchPage;