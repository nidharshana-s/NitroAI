import './Dashboard.css';
import logo from "../../public/logo.png";
import chat from "../../public/chat.png";
import image from "../../public/image.png";
import code from "../../public/code.png";
import arrow from "../../public/arrow.png";
import {useAuth} from "@clerk/clerk-react"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';



const Dashboard = () => {   
  
  //const {userId} = useAuth();

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (text) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json())
      
    },
    onSuccess: (id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${id}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;

    // await fetch("http://localhost:3000/api/chats", {
    //   method: "POST",
    //   credentials:true,
    //   headers : {
    //     "Content-Type" : "application/json",
    //   },
    //   body : JSON.stringify({text})
    // })
    mutation.mutate(text);
  };
  
  
    return (
      <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <img src={logo} alt="" />
          <h1>NITRO AI</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src={chat} alt="" />
            <span>Create a New Chat</span>
          </div>
          <div className="option">
            <img src={image} alt="" />
            <span>Analyze Images</span>
          </div>
          <div className="option">
            <img src={code} alt="" />
            <span>Help me with my Code</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input type="text" name="text" placeholder="Ask me anything..." />
          <button>
            <img src={arrow} alt="" />
          </button>
        </form>
      </div>
    </div>
    );
}
export default Dashboard;