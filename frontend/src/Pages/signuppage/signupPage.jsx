import { SignUp } from '@clerk/clerk-react';

const SignupPage = () => {
    return (
        <div className="flex h-full items-center justify-center">
            <SignUp path='/signup' signInUrl='signin'/>
        </div>
    );
}
export default SignupPage;
