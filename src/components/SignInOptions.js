import NoProfilePic from "./NoProfilePic.jpg"
// check if signed in
var signedin = false; // read in later
var userName = "undefined";
function SignInOptions() {
    try {
        var userName;
        var cookie = document.cookie
        cookie.split(";").forEach((item) => {
            if ((item.split("=")[0].split(" ")[1] === "username") || (item.split("=")[0] === "username")) {
                userName = item.split("=")[1];
            }
        });
    if ((userName !== undefined) && (userName !== "undefined")) {
        signedin = true;
    }
    } catch (err) {
        
    }
    if (!signedin) {
        return (<>
            <ul className="navbar-nav ms-auto p-2">
            <li>
            <a className="nav-link" href="/login">Login <span className="sr-only"></span></a>
            </li>
            <li>
            <a className="btn btn-outline-success my-2 my-sm-0" href="/signup">Signup</a>
            </li> 
            </ul>
            </>);
        }
    return (<>
            <ul className="navbar-nav ms-auto p-2">
            <a className="navbar navbar-light bg-light" href="/">
                <img src={NoProfilePic} width="40" height="$0" alt=""></img>
            </a>
            <li>
            <a className="nav-link" onClick={() => {
                document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                window.location.href = "/login";
            }}>Logout <span className="mr-only"></span></a>
            </li>
    
            </ul>
            </>);

}

export default SignInOptions;