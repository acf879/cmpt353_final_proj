import React, { useState, useEffect } from 'react';

function LandingPage() {
    var userName;
    var cookie = document.cookie
    cookie.split(";").forEach((item) => {
        if ((item.split("=")[0].split(" ")[1] === "username") || (item.split("=")[0] === "username")) {
            userName = item.split("=")[1];
        }
    });
    const [getList, setList] = useState([]);
    useEffect(() => {
        const promise = fetch("http://localhost:9000/").then(res => res.json()).then(res => setList(res));
        window.onload = async() => {
            await promise;
        }

    }, []);
    return (
        <>
            <main role="main">
            <br></br><br></br>
            <div className="jumbotron top-0">
                <div className="container">
                <h1 className="display-3">Welcome, {userName}!</h1>
                <p>This website is for the final project of cmpt353 and has been inspired by a mixture of reddit, stack overflow and other websites. Get Started by exploring the channels, if nothing suits you create a channel through the post channel tab.</p>
                <p><a className="btn btn-primary btn-lg" href="/channels" role="button">Get Started &raquo;</a></p>
                </div>
            </div>

            <br></br><br></br>
            
            <div className="container">

                <br></br><br></br>

                <div className="row">
                <div className="col-md-4">
                    <h2>Look for a channel</h2>
                    <p>Get started by looking at the channels!</p>
                    <p><a className="btn btn-secondary" href="/channels" role="button">See Channels &raquo;</a></p>
                </div>
                <div className="col-md-4">
                    <h2>Post a channel</h2>
                    <p>Can't find anything? Post a channel for your topic if it does not already exist!</p>
                    <p><a className="btn btn-secondary" href="/post_channel" role="button">Post a Channel &raquo;</a></p>
                </div>
                <div className="col-md-4">
                    <h2>Wrong account?</h2>
                    <p>Logged in using the wrong account? Login using the correct account here!</p>
                    <p><a className="btn btn-secondary" href="/login" role="button">Login &raquo;</a></p>
                </div>
            </div>
            </div>
            </main>
            

            <footer className="container">
            <p className="position-relative text-center align-bottom">&copy; Ashton Fritz 2023</p>
            </footer>
           

</>);
}
export default LandingPage;