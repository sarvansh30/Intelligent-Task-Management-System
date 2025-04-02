import { Link, useNavigate } from "react-router-dom";
import "./Login-Signup.css"
import { useState } from "react";
// import { UserSignUp } from "../APIs/getTDS";
import { UserSignUp } from "../APIs/auth_API_calls";

const SignUp = () =>{
    const [username,setUsername]=useState()
    const [password,setPasswrod]=useState()
    const [reEnterPass,setReEnterPass]=useState()

    const navigate = useNavigate();

    function handleClick(){
        UserSignUp(username,password)
        .then((response)=>navigate('/login'));
        setUsername('');
        setPasswrod('');
        setReEnterPass('');
        
    }

    return(
        <div className="login-body">
            <h3 style={{fontSize:"42px"}}>Sign up</h3>
            <div className="container1">
                <p>Username</p>
                <input 
                id="username"
                type="text" 
                className="txt-inp" 
                onChange={(e)=>setUsername(e.target.value)}/>

                <p>Enter password</p>
                <input
                id="password" 
                type="password" 
                className="txt-inp" 
                onChange={(e)=>setPasswrod(e.target.value)}/>

                <p>Re-enter your password</p>
                <input
                id="re-enter" 
                type="password" 
                className="txt-inp" />

                <button type="submit" className='submit-btn' onClick={handleClick}>Enter</button>
            </div>
            <p>Already have an account? <Link to="/">Login</Link></p>
        </div>
    )
}

export default SignUp;