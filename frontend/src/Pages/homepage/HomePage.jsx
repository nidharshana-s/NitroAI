import { Link } from 'react-router-dom';
import './homepage.css'
import bot from '../../public/bot.png'
import orb from '../../public/orbital.png'
import logo from '../../public/logo.png'

const Homepage = () => {

  const test = async() => {
    await fetch("http://localhost:3000/api/test",{
      credentials: "include",
    })
  }
  return (
    <div className="homepage">
      <img src={orb} alt="" className='orb'/>
      <div className='left'>
        <h1>NITRO AI</h1>
        <h2>Chat with me</h2>
        <h3>this is chitchat. chit and chat.urhfuiwfbiweuf7bhiorugfbiorugfbloifurwnof9uebfiuegfiurebgiuengi</h3>
        <Link to="/dashboard" className='get-start'>GET STARTED</Link>
        <button onClick={test}>test</button>
      </div>
      <div className='right'>
        <div className='imgContainer'>
          <div className='bgContainer'>

          </div>
          <img src={bot} className='bot' />
        </div>
      </div>
      <footer className='foot'>
        <img src={logo} alt="logo" className='logo'/>
        <h6>Made by Nidharshana </h6>
      </footer>
      {/* <Link to="/dashboard">Dashboard</Link> */}
    </div>
  );
};
export default Homepage;