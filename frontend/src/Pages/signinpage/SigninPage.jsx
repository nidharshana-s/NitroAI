import { SignIn, SignedOut } from '@clerk/clerk-react';

const Signinpage = () => {
    return (
        <div className="flex h-full items-center justify-center">
            <SignedOut>
                <SignIn path='/signin' routing="path" signUpUrl='/signup' forceRedirectUrl='/dashboard' />
            </SignedOut>
        </div>
    );
}
export default Signinpage;
