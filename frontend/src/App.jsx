import { BrowserRouter } from 'react-router-dom';
import AllRoutes from './AllRoutes';
import Card from './components/card';
import './App.css';
import React from 'react';
import Navbar from './components/navbar';


function App() {
  const dosasData = [
    {
      id: 1,
      title: "Chocolate Dosa",
      description: "A fusion creation that brings together the traditional dosa and a rich chocolate spread for an unexpected sweet crunch."
    },
    {
      id: 2,
      title: "Pizza Dosa",
      description: "Imagine a crispy dosa topped with layers of melted cheese, tangy tomato sauce, and a sprinkle of Italian herbs."
    },
    {
      id: 3,
      title: "Burger Dosa",
      description: "This dosa fills in with spiced veggie or meat patties, fresh lettuce, and a drizzle of tangy sauce, embodying the spirit of a burger."
    },
    {
      id: 4,
      title: "Samosa Dosa",
      description: "A creative twist where the dosa is stuffed with a spicy, potato-rich filling reminiscent of a classic samosa."
    },
    {
      id: 5,
      title: "Ice Cream Dosa",
      description: "A delightful dessert dosa served with a scoop of ice cream, drizzled with caramel or chocolate sauce for a playful treat."
    },
  ];

  return (
    <>
      <BrowserRouter>
      <Navbar />
      <div className="main-content">
        <AllRoutes />
      </div>
    </BrowserRouter>

      <div className="card-column">
        {dosasData.map((dosa) => (
          <Card
            key={dosa.id}
            title={dosa.title}
            description={dosa.description}
          />
        ))}
      </div>
    </>
  );
}

export default App;