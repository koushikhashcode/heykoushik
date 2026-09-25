import React from 'react';
import './introduction.css';
import heroImage from '../../assets/profile image/Picsart_26-09-14_23-31-48-453.jpg.jpeg';

const Introduction = () => {
  return (
    <div>
      <main className="hero_next_section">
        <div className="hero">
          <div className="big_text">
            <img src={heroImage} alt="Hero" className="hero_img" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Introduction;
