import { SignIn } from '@clerk/clerk-react';
import './Signinpage.css';

const Signinpage = () => {
    return (
        <div className="signinpage">
            <SignIn path='/signin' signInUrl='signup' />
        </div>
    );
}
export default Signinpage;