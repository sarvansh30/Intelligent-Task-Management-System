import SignUp from './SignupPage'
import "./Login-Signup.css"
import { Link } from 'react-router-dom';
const LoginPage = ()=>{

    return(
        <div className="login-body">
            <h3 style={{fontSize:"42px"}}>Login Page</h3>
            <form action=""className="container1">
            <p>Enter your username:</p>
            <input type="text" name="username" id="username" className='txt-inp'/>
            <p>Enter your password:</p>
            <input type="password" name="password" id="password" className='txt-inp'/>
            <button type="submit" className='submit-btn'>Enter</button>
            </form>
            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
    );
}
export default LoginPage;