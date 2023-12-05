import React from 'react';
import HeapOverFlowImg from './HeapOverflowImg.png';
import './Signup.css';

const Click = (e) => {
  var userNameTaken = false;
  e.preventDefault();
  fetch("http://localhost:9000/users/").then(res => res.json()).then(res => {
    for (var key in res['users']['userName']) {
      if (res['users'][key]['userName'] === document.getElementById("floatingUsername").value) {
        userNameTaken = true;
      }
    }

    if (userNameTaken) {
      alert("Username already exists");
    } else {
      fetch("http://localhost:9000/user/", {
        method: "POST", 
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "userName": document.getElementById("floatingUsername").value,
            "password": document.getElementById("floatingPassword").value,
            "email": document.getElementById("floatingInput").value
        })
    }).then(res => res.json()).then(res => console.log(res)).then(res => window.location.href = "/login").catch(err => console.log(err));
    } 
  });
}

function Signup() {

    return (
        <>

    <main className="form-signin text-center">
      <form>
        <img className="mb-4" src={HeapOverFlowImg} alt="" width="72" height="57"></img>
        <h1 className="h3 mb-3 fw-normal">Signup</h1>
    
        <div className="form-floating">
          <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"></input>
          <label for="floatingInput">Email address</label>
        </div>
        <div className="form-floating">
          <input type="username" className="form-control" id="floatingUsername" placeholder="Username"></input>
          <label for="floatingUsername">Username</label>
        </div>
        <div className="form-floating">
          <input type="password" className="form-control" id="floatingPassword" placeholder="Password"></input>
          <label for="floatingPassword">Password</label>
        </div>
    
        <button className="w-100 btn btn-lg btn-primary" type="submit" onClick={Click}>Signup</button> 
        <br></br> <br></br>
          <label>
            <a href="/login">Already have an account? Sign in</a>
          </label>
        <p className="mt-5 mb-3 text-muted">&copy; Ashton Fritz 2023</p>
      </form>
    </main>
</>);
}
export default Signup;