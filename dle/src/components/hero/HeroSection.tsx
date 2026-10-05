import { useState, useRef, useEffect } from 'react';
import './herosection.css';

// Replace these placeholders with your actual image paths or URLs
const SLIDER_IMAGES = [
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1600&auto=format&fit=crop",

];

function HeroSection() {
  const [rotation, setRotation] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startRotation = useRef(0);

  const totalItems = SLIDER_IMAGES.length;
  
  // Adjusted radius and angle for a massive, screen-wide concave curve
  const radius = 1100; 
  const angleStep = 20; // Larger step to space out the images evenly across the monitor

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startRotation.current = rotation;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - startX.current;
      
      // Changed to '-' to invert drag direction, making movement match mouse/hand gestures
      const newRotation = startRotation.current - deltaX / 6;
      setRotation(newRotation);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [rotation]);

  return (
    <section className="hero-section">
      <div className="tagline">
        <p className="tagline-text">For Every Special Moment</p>
      </div>
      <div className="hero-content">
        <p className="hero-title">Every Meaningful Moment <br />Deserves Its Own Page</p>
        <p className="hero-description">Turn your memories, your journey, and your unspoken feelings into a beautiful digital experience made just for them.</p>
      </div>

      {/* 3D Concave Panorama Slider Container */}
      <div 
        className="panorama-container"
        onMouseDown={handleMouseDown}
      >
        <div 
          className="panorama-carousel"
          style={{ transform: `rotateY(${rotation}deg)` }}
        >
          {SLIDER_IMAGES.map((src, index) => {
            const centerOffset = (totalItems - 1) / 2;
            const itemAngle = (index - centerOffset) * angleStep;

            return (
              <div
                key={index}
                className="panorama-item"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(-${radius}px)`,
                }}
              >
                <img src={src} alt={`Moment ${index + 1}`} draggable="false" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
