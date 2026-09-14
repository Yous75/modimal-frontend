import React from 'react';
import './Sustainlanding.css';
import cottonBg from '../../assets/cotton-bg.jpg'; 
import { useNavigate } from "react-router-dom";

const Sustainlanding = () => {
  const navigate = useNavigate();
  return (
    <section 
      className="sustain-container" 
      style={{ backgroundImage: `url(${cottonBg})` }}
    >
      <div className="sustain-content">
        <p className="sustain-text">
          Stylish Sustainability In Clothing Promotes Eco-Friendly Choices For A Greater Future
        </p>
        <button onClick={() => navigate("/sustainability/mission")} className="sustain-btn" >Sustainability</button>
      </div>
    </section>
  );
};

export default Sustainlanding;