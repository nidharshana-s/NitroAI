import { SignIn, SignedOut } from '@clerk/clerk-react';
import './Signinpage.css';

const Signinpage = () => {
    return (
        <div className="signinpage">
            <SignedOut>
                <SignIn path='/signin' routing="path" signUpUrl='/signup' forceRedirectUrl='/dashboard' className='sign-but'/>
            </SignedOut>
        </div>
    );
}
export default Signinpage;