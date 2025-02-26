import { useAuth } from '@clerk/clerk-react';
import './DashboardLayout.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ChatList from '../../components/chatlist/ChatList';


const DashboardLayout = () => {

    const navigate = useNavigate();
    const {userId, isLoaded} = useAuth();

    useEffect(() => {
        if(isLoaded && !userId){
            navigate('/signin');
        }
    }, [isLoaded, userId, navigate]);

    if(!isLoaded){
        return <div>Loading...</div>
    }
    
    return (
        <div className="dashboardLayout">
                <ChatList />
            
            <main className='content'>
                <Outlet />
            </main>
        </div>
    );
}
export default DashboardLayout;