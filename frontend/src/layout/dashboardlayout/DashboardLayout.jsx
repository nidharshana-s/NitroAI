import { useAuth } from '@clerk/clerk-react';
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
        return <div className="flex h-full items-center justify-center text-text-muted">Loading...</div>
    }

    return (
        <div className="flex h-full gap-2 pt-2.5">
            <ChatList />
            <main className="flex-[4] rounded-xl bg-bg-dark">
                <Outlet />
            </main>
        </div>
    );
}
export default DashboardLayout;
