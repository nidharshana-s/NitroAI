import { useAuth } from '@clerk/clerk-react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


const Dashboard = () => {
    const {userID, isLoaded} = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
      if(isLoaded && !userID){
        navigate('/signin');
      }
    }, [isLoaded, userID, navigate]);

    if(!isLoaded){
      return <div>Loading...</div>
    }

    
    return (
        <div className="dashboard">
        <h1>Dashboard</h1>
        </div>
    );
}
export default Dashboard;