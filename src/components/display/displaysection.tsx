import './displaysection.css';
import phone from '../../assets/SmartphoneMockup.svg';

function DisplaySection() {
    return (
        <div className="display-section">
            <div className="display-content">
                <div className="display-text">
                    <p className="display-subtext1">
                        Simple, beautiful tools to create something heartfelt for the people and moments that matter.
                    </p>
                    <p className="display-subtext2">
                        Smooth transitions, elegant storytelling, and emotional details come Together in a preview that feels almost alive.
                    </p>
                </div>
                <div className="display-phone-container">
                    <img src={phone} alt="Smartphone Mockup" className='display-phone' />
                </div>
            </div>
        </div>
    );
}

export default DisplaySection;
