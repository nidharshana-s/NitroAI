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
            <div className="flex h-screen flex-col px-16 py-3 max-md:px-5">
                <header className="flex items-center justify-between border-stone/20 pb-2.5 text-base text-stone">
                    <Link to="/" className="flex items-center gap-2 font-bold">
                        <img src={logo} alt="" className="h-8 w-8" />
                        <span>NITRO AI</span>
                    </Link>
                    <SignedOut>
                        <SignInButton className="btn-light" />
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </header>

                <main className="flex-1 overflow-hidden">
                    <Outlet />
                </main>
            </div>
            </QueryClientProvider>
        </ClerkProvider>
    );
}
export default RootLayout;
