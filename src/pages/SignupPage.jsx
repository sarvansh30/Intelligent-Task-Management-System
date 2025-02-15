import { Link } from "react-router-dom";
import "./Login-Signup.css"
import { useState } from "react";

const SignUp = () =>{
    const [username,setUsername]=useState()
    const [password,setPasswrod]=useState()
    const [reEnterPass,setReEnterPass]=useState()
    
    return(
        <div className="login-body">
            <h3 style={{fontSize:"42px"}}>Sign up</h3>
            <div className="container1">
                <p>Username</p>
                <input 
                id="username"
                type="text" 
                className="txt-inp" />

                <p>Enter password</p>
                <input
                id="password" 
                type="password" 
                className="txt-inp" />

                <p>Re-enter your password</p>
                <input
                id="re-enter" 
                type="password" 
                className="txt-inp" />

                <button type="submit" className='submit-btn'>Enter</button>
            </div>
            <p>Already have an account? <Link to="/">Login</Link></p>
        </div>
    )
}

export default SignUp;