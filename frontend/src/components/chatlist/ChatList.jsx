import { Link } from 'react-router-dom'
import './chatlist.css'
import logo from "../../public/logo.png";
import {
    useQuery,
  } from '@tanstack/react-query'



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
        <div className='chatlist'>
            <span className='title'>DASHBOARD</span>
                <Link to="/dashboard">Create a new chat</Link>
                <Link to="/">Explore NITRO AI</Link>
                <Link to="/">Contact</Link>
                <hr/>
                <span className='title'>RECENT CHATS</span>
                <div className="list">
                    {isPending 
                    ? "isLoading" 
                    : error 
                    ? console.log(error.message) 
                    : data?.map((chat) => (
                        <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
                            {chat.title}
                        </Link>
                    ))}
                </div>
                <hr/>
                <div className="upgrade">
                    <img src={logo} alt="logo" />
                    <div className="texts">
                        <span>Upgrade to NITRO AI PRO</span>
                        <span>Get unlimited access to all features</span>
                    </div>
                </div>
        </div>
    )
}

export default ChatList