import { Link } from 'react-router-dom'
import './chatlist.css'
import logo from "../../public/logo.png";


const ChatList = () =>{
    return (
        <div className='chatlist'>
            <span className='title'>DASHBOARD</span>
                <Link to="/dashboard">Create a new chat</Link>
                <Link to="/">Explore NITRO AI</Link>
                <Link to="/">Contact</Link>
                <hr/>
                <span className='title'>RECENT CHATS</span>
                <div className="list">
                    <Link to="/">chat list</Link>
                    <Link to="/">chat list</Link>
                    <Link to="/">chat list</Link>
                    <Link to="/">chat list</Link>
                    <Link to="/">chat list</Link>
                    <Link to="/">chat list</Link>
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