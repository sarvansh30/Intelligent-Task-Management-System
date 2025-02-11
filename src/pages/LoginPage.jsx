import SignUp from './SignupPage'
import "./Login-Signup.css"
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { checkLogin } from '../APIs/getTDS';
const LoginPage = ()=>{
    const navigate = useNavigate();
    function handleClick(event){
        event.preventDefault();
        console.log(event);
        const formData=new FormData(event.currentTarget);
        console.log(formData.get("username"));
        checkLogin(formData.get("username"),formData.get("password"))
        .then((data)=>{
            if(data.message){
                navigate('/todoapp')
            }
        })
        event.currentTarget.reset();
    }
    return(
        <div className="login-body">
            <h3 style={{fontSize:"42px"}}>Login Page</h3>
            <form action=""className="container1" onSubmit={handleClick}>
            <p>Enter your username:</p>
            <input type="text" name="username" id="username" className='txt-inp'/>
            <p>Enter your password:</p>
            <input type="password" name="password" id="password" className='txt-inp'/>
            <button type="submit" className='submit-btn' >Enter</button>
            </form>
            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
    );
}
export default LoginPage;