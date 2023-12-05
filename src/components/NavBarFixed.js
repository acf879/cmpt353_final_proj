import HeapOverflowImg from './HeapOverflowImg.png'
import SignInOptions from "./SignInOptions";

function NavBarFixed() { // need to add logo for home instead of home button
    var userName = "undefined";
    try {
    var userName;
    var cookie = document.cookie
    cookie.split(";").forEach((item) => {
        if ((item.split("=")[0].split(" ")[1] === "username") || (item.split("=")[0] === "username")) {
            userName = item.split("=")[1];
        }
    });
    } catch(err) {

    }
    if (((userName === undefined) || (userName === "undefined")) && ((window.location.pathname !== "/login") && (window.location.pathname !== "/signup"))){
       window.location.href = "/login"
    }
    const SearchSubmit = () => {
        window.location.href = "/search/" + document.getElementById("search").value;
    }
    return (<>
    <div className='NavBarFixed'>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <a className="navbar-brand" href={"/"}>
                <img src={HeapOverflowImg} width="30" height="30" alt=""></img>
            </a>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <a className="nav-link" aria-current="page" href={"/channels"}>Channels</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href={"/post_channel"}>Post Channel</a>
                    </li>
                    <div className="d-flex">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" id="search" onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                SearchSubmit();
                            }
                        }}></input>
                        <button className="btn btn-outline-success" type="submit" onClick={SearchSubmit}>Search</button>
                    </div>
                </ul>
                <SignInOptions />
            </div>
        </div>
        </nav>        
    </div>
    </>);
}

export default NavBarFixed;