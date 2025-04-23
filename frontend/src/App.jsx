import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import AllRoutes from './AllRoutes';
import Card from './components/Card';
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
                <div className="card-column">
                    {dosas.length > 0 ? (
                        dosas.map((dosa) => (
                            <Card key={dosa._id} title={dosa.name} description={dosa.description} />
                        ))
                    ) : (
                        <p>Loading or no data available...</p>
                    )}
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;