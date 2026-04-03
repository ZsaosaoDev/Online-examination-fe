import './App.css';
import AppRoutes from './router/AppRoutes';
import Headers from './components/Header';
const App = () => {

    return (
        <div className="app-container">
            {/* <Headers /> */}
            <AppRoutes />
        </div>
    );
};

export default App;
