import './Dashboard.css';
import logo from "../../public/logo.png";
import chat from "../../public/chat.png";
import image from "../../public/image.png";
import code from "../../public/code.png";
import arrow from "../../public/arrow.png";



const Dashboard = () => {    
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
        <form >
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