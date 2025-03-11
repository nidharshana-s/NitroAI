import './rootlayout.css';
import { Link, Outlet } from 'react-router-dom';
import logo from "../../public/logo.png";
import { ClerkProvider } from '@clerk/clerk-react'
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import {
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const queryClient = new QueryClient()


const RootLayout = () => {
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
            <QueryClientProvider client={queryClient}>

            <div className='rootLayout'>
                <header>
                    <Link to="/">
                    <div className="logo-con">
                        <img src={logo} alt="" className='logo' />
                        <span className='logo-bot'>NITRO AI</span>
                    </div>
                        
                    </Link>
                    <SignedOut>
                        <SignInButton className='sign-but'/>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </header>

                <main>
                    <Outlet />
                </main>
            </div>        
            </QueryClientProvider>
        </ClerkProvider>

    );
}
export default RootLayout;