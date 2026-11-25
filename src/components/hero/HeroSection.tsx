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
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1600&auto=format&fit=crop"
];

function HeroSection() {
  const [rotation, setRotation] = useState(0);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [isDraggingEffect, setIsDraggingEffect] = useState(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startRotation = useRef(0);

  const totalItems = SLIDER_IMAGES.length;
  const radius = 1100;
  const angleStep = 20;

  // Track viewport changes to swap slider layout for a responsive image grid
  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isMobileOrTablet) return; // Prevent calculations when viewing grid
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    isDragging.current = true;
    setIsDraggingEffect(true);
    startX.current = e.clientX;
    startRotation.current = rotation;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || isMobileOrTablet) return;
    const deltaX = e.clientX - startX.current;
    setRotation(startRotation.current - deltaX / 6);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    isDragging.current = false;
    setIsDraggingEffect(false);
  };

  return (
    <section className="hero-section">
      <div className="tagline">
        <p className="tagline-text">For Every Special Moment</p>
      </div>
      <div className="hero-content">
        <p className="hero-title">Every Meaningful Moment <br />Deserves Its Own Page</p>
        <p className="hero-description">Turn your memories, your journey, and your unspoken feelings into a beautiful digital experience made just for them.</p>
      </div>

      {/* Conditionally switch layouts dynamically based on screen viewport state size */}
      {isMobileOrTablet ? (
        <div className="hero-responsive-image-grid">
          {SLIDER_IMAGES.slice(0, 2).map((src, index) => (
            <div key={index} className="grid-image-item">
              <img src={src} alt={`Moment ${index + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      ) : (
        /* 3D Concave Panorama Slider Container preserved natively */
        <div
          className="panorama-container"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            className={`panorama-carousel${isDraggingEffect ? ' is-dragging' : ''}`}
            style={{ transform: `rotateY(${rotation}deg)` }}
          >
            {SLIDER_IMAGES.map((src, index) => {
              const centerOffset = (totalItems - 1) / 2;
              const itemAngle = (index - centerOffset) * angleStep;
              return (
                <div
                  key={index}
                  className="panorama-item"
                  style={{ transform: `rotateY(${itemAngle}deg) translateZ(-${radius}px)` }}
                >
                  <img src={src} alt={`Moment ${index + 1}`} draggable="false" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

export default HeroSection;
