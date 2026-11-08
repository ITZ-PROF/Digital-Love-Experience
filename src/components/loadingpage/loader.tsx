import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './loader.css';

import icon1 from '../../assets/loaderIcons/heart.svg';
import icon2 from '../../assets/loaderIcons/give.svg';
import icon3 from '../../assets/loaderIcons/family.svg';
import icon4 from '../../assets/loaderIcons/person.svg';
import icon5 from '../../assets/loaderIcons/person.svg';
import icon6 from '../../assets/loaderIcons/lover.svg';

const LOADING_ICONS = [icon1, icon2, icon3, icon4, icon5, icon6];

interface LoadingPageProps {
  isModal?: boolean;     // ⬅️ NEW: Set to true if used as a modal overlay popup
  isOpen?: boolean;      // Used only when isModal={true} to toggle visibility
  isExiting?: boolean;   // Controls your custom 700ms exit fade animation
}

function LoadingPage({ isModal = false, isOpen = true, isExiting = false }: LoadingPageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // 1. Unified Icon Rotation Loop
  useEffect(() => {
    // Only animate if the component is active/visible
    const shouldAnimate = !isModal || isOpen;
    if (!shouldAnimate) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % LOADING_ICONS.length);
    }, 400);

    return () => clearInterval(interval);
  }, [isModal, isOpen]);

  // 2. Native HTML Dialog Controller (Only triggers when isModal is true)
  useEffect(() => {
    if (!isModal) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open && !isExiting) {
      dialog.close();
    }
  }, [isModal, isOpen, isExiting]);

  // Clean up native dialog visibility tracking once the fade ends
  useEffect(() => {
    if (!isModal) return;
    const dialog = dialogRef.current;
    if (isExiting && dialog) {
      const timeout = setTimeout(() => dialog.close(), 700);
      return () => clearTimeout(timeout);
    }
  }, [isModal, isExiting]);

  // If used as a modal and it's completely closed/exited, don't render anything
  if (isModal && !isOpen && !isExiting) return null;

  // 3. Shared Inner Markup Elements Layout
  const renderContent = () => (
    <div className="loading-icon-wrapper">
      {LOADING_ICONS.map((src, index) => (
        <img
          key={index}
          src={src}
          alt="Loading step"
          className={`loading-icon ${index === activeIndex ? 'active' : ''}`}
        />
      ))}
    </div>
  );

  // 4. Conditional Wrapper Engine
  if (isModal) {
    // MODAL PORTAL MODE
    return createPortal(
      <dialog
        ref={dialogRef}
        className={`loading-page-container is-modal-view ${isExiting ? 'is-exiting' : ''}`}
        role="status"
        aria-label="Loading action state"
      >
        {renderContent()}
      </dialog>,
      document.body
    );
  }

  // STANDARD INLINE LANDING PAGE MODE (Default)
  return (
    <div
      className={`loading-page-container ${isExiting ? 'is-exiting' : ''}`}
      role="status"
      aria-label="Loading your experience"
    >
      {renderContent()}
    </div>
  );
}

export default LoadingPage;
