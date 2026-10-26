import './auth.css';
import InputField from '../../components/inputfield/input';
import authImg from '../../assets/authimage.svg';
import fulllogo from '../../assets/full-logo.svg';
import { useEffect, useState } from 'react';
import { useAuth } from '../../stores/authstore';
import { useNavigate } from 'react-router-dom';
import LoadingPage from '../../components/loadingpage/loader'; // 1. Import your loader component

export default function Login(){
    const navigate = useNavigate();
    const authenticated = useAuth((state) => state.authenticated);
    const setAuthenticated = useAuth((state) => state.setAuthenticated);
    
    const [loading, setLoading] = useState(false);
    const [isExiting, setIsExiting] = useState(false); // 2. State to handle the 700ms smooth fade out
    const [isExistingUser, setIsExistingUser] = useState(false);
    const [verify, setVerify] = useState(false);

    // Handles layout toggling and resets steps to step 
    const handleFormToggle = (e: any, isExisting: boolean) => {
        e.preventDefault(); 
        setIsExistingUser(isExisting);
        setVerify(false); 
    };

    // 3. Form Submission Action (Triggers when final code is verified)
    const verifyAuth = () => {
        setLoading(true); // Open the loader modal overlay immediately
        setIsExiting(false);

        // Simulate an API network request look-up
        setTimeout(() => {
            setAuthenticated(true); // Update Zustand global state
            setIsExiting(true);     // Start the 700ms CSS fade-out transition

            // Wait for the fade out animation to finish before moving pages
            setTimeout(() => {
                setLoading(false);
                navigate('/');
            }, 700); // Matches your CSS fade animation duration
        }, 2300); // Combined with 700ms fade makes a perfect 3-second process
    };

    return(
        <div className='authPage'>
            {/* 4. Mount your Loader as a top-layer Modal Overlay */}
            <LoadingPage isModal={true} isOpen={loading} isExiting={isExiting} />

            <div className='authpage-left'>
                <img src={fulllogo} alt="logo" className="auth-logo" /> 
                
                {/* Dynamic Header Prompts */}
                <p className='prompt'>
                    {isExistingUser ? 'Enter Your Experience Room' : 'Build Your Experience Room'}
                </p>
                
                {/* Condition-Driven Dynamic Input Fields */}
                {!isExistingUser ? (
                    <>
                        <InputField label='Full Name' multiline={false}/>
                        <InputField label='Phone Number' multiline={false}/>
                        {verify && <InputField label='Verification Code' multiline={false}/>}
                    </>
                ) : (
                    <>
                        <InputField label='Phone Number' multiline={false}/>
                        {verify && <InputField label='Verification Code' multiline={false}/>}
                    </>
                )}
                
                {/* Adaptive CTA Action Button text */}
                <button className='verify-btn' onClick={!verify ? () => setVerify(true) : verifyAuth}>
                   {verify 
                       ? (isExistingUser ? 'Enter Room' : 'Create Room') 
                       : 'Verify'
                   }
                </button>
                
                {/* Adaptive Navigation Footer Link options */}
                <p className='login-action'>
                    {isExistingUser ? (
                        <>
                            Need a new space?{' '}
                            <a className='login-link' href='/' onClick={(e) => handleFormToggle(e, false)}>
                                Build Room
                            </a>
                        </>
                    ) : (
                        <>
                            Have an existing room?{' '}
                            <a className='login-link' href='/' onClick={(e) => handleFormToggle(e, true)}>
                                Enter Room
                            </a>
                        </>
                    )}
                </p>
            </div>
            
            <div className='authpage-right'>
                <img src={authImg} alt="authimg" className='authImage' />
            </div>
        </div>
    );
}
