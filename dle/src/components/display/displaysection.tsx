import './displaysection.css';
import phone from '../../assets/SmartphoneMockup.svg';


function DisplaySection() {
    return (
        <div className="display-section">
            <div className="display-content">
                <div className="display-text">
                    <p className="display-subtext1">
                        Simple, beautiful tools to <br/>create something heartfelt<br/> for the  people and moments<br/> that matter.
                    </p>
                    <p className="display-subtext2">
                        Smooth transitions, elegant <br/>storytelling, and emotional <br/>details come Together in a <br/>preview that feels almost alive.
                    </p>

                </div>
                <img src={phone} alt="Smartphone Mockup" className='display-phone'  />
            </div>
        </div>
    );
}

export default DisplaySection;