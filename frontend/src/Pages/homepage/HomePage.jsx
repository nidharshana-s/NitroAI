import { Link } from 'react-router-dom';
import bot from '../../public/bot.png'
import orb from '../../public/orbital.png'
import logo from '../../public/logo.png'

const Homepage = () => {
  return (
    <div className="relative flex h-full items-center gap-[100px] max-lg:flex-col max-lg:gap-0">
      <img src={orb} alt="" className="absolute bottom-0 left-0 -z-10 opacity-[0.04]" />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <h1 className="gradient-heading">NITRO AI</h1>
        <h2 className="text-stone">Chat with me</h2>
        <Link to="/dashboard" className="btn-primary mt- px-6 py-4 text-lg">
          GET STARTED
        </Link>
      </div>
      {/* <div className="flex flex-1">
        <div className="m-0.5 flex h-[90%] w-[90%] items-center justify-center rounded-2xl border border-stone/20 bg-charcoal p-8">
          <img src={bot} className="h-full w-full animate-bot object-contain" alt="NITRO AI bot" />
        </div> 
      </div> */}
      <footer className="fixed bottom-0 left-0 flex w-full items-center justify-center gap-2 p-5">
        <img src={logo} alt="logo" className="h-8 w-auto" />
        <h6 className="text-sm text-stone">Made by Nidharshana</h6>
      </footer>
    </div>
  );
};
export default Homepage;
