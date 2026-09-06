import React from 'react';
import { motion } from 'motion/react';

const DISCIPLINES = [
  { id: 'filmmaking', index: '01', name: 'FILMMAKING', category: 'Film' },
  { id: 'photography', index: '02', name: 'PHOTOGRAPHY', category: 'Photography' },
  { id: 'art', index: '03', name: 'ART', category: 'Art' },
  { id: 'writing', index: '04', name: 'WRITING', category: 'Writing' },
];

export const CreativeCard = ({ style }) => {
  return (
    <motion.div 
      className="card creative-card" 
      id="creative-section"
      style={style}
    >
      {/* Header Block */}
      <div className="creative-header-block">
        <h3 className="creative-heading">CREATIVE</h3>
        <p className="creative-statement">
          Beyond code — image, form, and story.
        </p>
      </div>

      {/* 2x2 Architectural Quadrant Grid */}
      <div className="creative-quadrant-grid">
        {DISCIPLINES.map((item) => (
          <div 
            key={item.id} 
            className="creative-grid-item group"
          >
            <span className="creative-index">{item.index}</span>
            <span className="creative-name">{item.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CreativeCard;
