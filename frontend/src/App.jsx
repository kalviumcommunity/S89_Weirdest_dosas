import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import AllRoutes from './AllRoutes';
import { getDosas } from './api';
import './App.css';

function App() {
    const [dosas, setDosas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getDosas();
            setDosas(data);
        };
        fetchData();
    }, []);

    return (
        <BrowserRouter>
            <Navbar />
            <div className="main-content">
                <AllRoutes />
                
            </div>
        </BrowserRouter>
    );
}

export default App;