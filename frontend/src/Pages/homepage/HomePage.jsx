import { Link } from 'react-router-dom';
import './homepage.css'

const Homepage = () => {
  return (
    <div className="homepage">
      <h1>Homepage</h1>
      <Link to="/dashboard">Dashboard</Link>
    </div>
  );
};
export default Homepage;