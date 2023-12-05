import React, { useState } from 'react';
import './Login.css';
import HeapOverFlowImg from './HeapOverflowImg.png';
const Click = (e) => {
  e.preventDefault();

    fetch("http://localhost:9000/users/").then(res => res.json()).then(res => {
      let userNameCorrect = false;

      for (var key in res['users']) {
        if ((res['users'][key]['userName'] === document.getElementById("floatingInput").value) && (res['users'][key]['password'] === document.getElementById("floatingPassword").value)) {
          userNameCorrect = true;
        }
      }
      if (!userNameCorrect) {
        alert("Incorrect username or password");
      } else {
        document.cookie = "username=" + document.getElementById("floatingInput").value;
      } 
    }).then(res => {
      try {
        var userName;
        var cookie = document.cookie
        cookie.split(";").forEach((item) => {
            if ((item.split("=")[0].split(" ")[1] === "username") || (item.split("=")[0] === "username")) {
                userName = item.split("=")[1];
            }
        });
      if (!(userName === undefined) || !(userName === "undefined")) {
        window.location.href = "/";
      }
    } catch (err) {
      console.log(err);
    }
    });
}


function Login() {
    
    return (
        <>
    <main className="form-signin text-center">
      <form>
        <img className="mb-4" src={HeapOverFlowImg} alt="" width="72" height="57"></img>
        <h1 className="h3 mb-3 fw-normal">Sign in</h1>
    
        <div className="form-floating">
          <input type="email" className="form-control" id="floatingInput" placeholder="UserName"></input>
          <label for="floatingInput">Username</label>
        </div>
        <div className="form-floating">
          <input type="password" className="form-control" id="floatingPassword" placeholder="Password"></input>
          <label for="floatingPassword">Password</label>
        </div>
        <button className="w-100 btn btn-lg btn-primary" type="submit" onClick={Click}>Sign in</button>
        <br></br><br></br>
          <label>
            <a href="/signup">Dont have an account? Create one</a>
          </label>
        <p className="mt-5 mb-3 text-muted">&copy; Ashton Fritz 2023</p>
      </form>
    </main>

</>);
}
export default Login;