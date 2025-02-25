import { SignUp } from '@clerk/clerk-react';
import './signupPage.css';

const SignupPage = () => {
    return (
        <div className="signupPage">
            <SignUp path='/signup' signInUrl='signin'/>
        </div>
    );
}
export default SignupPage;