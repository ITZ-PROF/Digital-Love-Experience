import { useNavigate } from 'react-router-dom';
import './cta.css'


function CTA(){
    const navigate = useNavigate();

    return(
        <div className='cta-section'>
        <div className='cta-section-wrapper'>
            <p className='message'>Ready to Create Something <br/> Memorable?</p>
            <p className='sub-message'>Create a heartfelt page for birthdays, anniversaries, graduations,
                 <br/>apologies, surprises, and more in just a few minutes.</p>
            <button
                type="button"
                className="btn-primary"
                onClick={() => navigate('/form')}
            >
                Create Experience
            </button>
        </div>
        </div>
    )
}


export default CTA;