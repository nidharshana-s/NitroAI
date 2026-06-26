import logo from "../../public/logo.png";
import chat from "../../public/chat.png";
import image from "../../public/image.png";
import code from "../../public/code.png";
import arrow from "../../public/arrow.png";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
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
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${id}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    mutation.mutate(text);
  };

  return (
    <div className="flex h-full flex-col items-center">
      <div className="flex flex-1 w-1/2 flex-col items-center justify-center gap-12 max-lg:w-full max-lg:px-4">
        <div className="flex items-center gap-5 opacity-20">
          <img src={logo} alt="" className="h-16 w-16" />
          <h1 className="gradient-heading">NITRO AI</h1>
        </div>
        <div className="flex w-full items-center justify-between gap-12 max-md:flex-col">
          <div className="card flex flex-1 flex-col gap-2.5 text-sm font-light">
            <img src={chat} alt="" className="h-10 w-10 object-cover" />
            <span>Create a New Chat</span>
          </div>
          <div className="card flex flex-1 flex-col gap-2.5 text-sm font-light">
            <img src={image} alt="" className="h-10 w-10 object-cover" />
            <span>Analyze Images</span>
          </div>
          <div className="card flex flex-1 flex-col gap-2.5 text-sm font-light">
            <img src={code} alt="" className="h-10 w-10 object-cover" />
            <span>Help me with my Code</span>
          </div>
        </div>
      </div>
      <div className="mt-auto flex w-1/2 rounded-2xl border border-stone/20 bg-bg-surface max-lg:w-full max-lg:px-4">
        <form onSubmit={handleSubmit} className="mb-2.5 flex w-full items-center justify-between gap-5">
          <input
            type="text"
            name="text"
            placeholder="Ask me anything..."
            className="prompt-input"
          />
          <button type="submit" className="icon-btn mr-5">
            <img src={arrow} alt="Send" />
          </button>
        </form>
      </div>
    </div>
  );
}
export default Dashboard;
