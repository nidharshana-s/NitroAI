import { Link } from 'react-router-dom'
import logo from "../../public/logo.png";
import { useQuery } from '@tanstack/react-query'

const ChatList = () =>{
    const {isPending, error, data} = useQuery({
        queryKey: ['userChats'],
        queryFn: async() => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/userchats`,{
                credentials:"include"
            })
            return res.json()
        }
    })

    return (
        <div className="flex h-full w-[15%] min-w-[180px] flex-col text-stone max-md:hidden">
            <span className="mb-2.5 text-[10px] font-semibold tracking-wider text-stone/70">DASHBOARD</span>
            <Link to="/dashboard" className="rounded-lg p-2.5 transition-colors hover:bg-bg-surface">
                Create a new chat
            </Link>
            <Link to="/" className="rounded-lg p-2.5 transition-colors hover:bg-bg-surface">
                Explore NITRO AI
            </Link>
            <Link to="/" className="rounded-lg p-2.5 transition-colors hover:bg-bg-surface">
                Contact
            </Link>
            <hr className="my-5 h-0.5 rounded border-none bg-stone/20" />
            <span className="mb-2.5 text-[10px] font-semibold tracking-wider text-stone/70">RECENT CHATS</span>
            <div className="scrollbar-hide flex flex-col overflow-y-auto">
                {isPending
                    ? <span className="text-stone/60">Loading...</span>
                    : error
                    ? console.log(error.message)
                    : data?.map((chat) => (
                        <Link
                            to={`/dashboard/chats/${chat._id}`}
                            key={chat._id}
                            className="rounded-lg p-2.5 transition-colors hover:bg-bg-surface"
                        >
                            {chat.title}
                        </Link>
                    ))}
            </div>
            <hr className="my-5 h-0.5 rounded border-none bg-stone/20" />
            <div className="mt-auto flex items-center gap-2.5 text-xs">
                <img src={logo} alt="logo" className="h-6 w-6" />
                <div className="flex flex-col">
                    <span className="font-semibold text-stone">Upgrade to NITRO AI PRO</span>
                    <span className="text-stone/70">Get unlimited access to all features</span>
                </div>
            </div>
        </div>
    )
}

export default ChatList
