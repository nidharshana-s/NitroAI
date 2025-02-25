import './DashboardLayout.css';
import { Outlet } from 'react-router-dom';


const DashboardLayout = () => {
    return (
        <div className="dashboardLayout">
            <header>
                menu
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
}
export default DashboardLayout;