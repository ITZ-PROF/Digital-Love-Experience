import './auth.css';
import InputField from '../../components/inputfield/input';
import authImg from '../../assets/authimage.svg';
import fulllogo from '../../assets/full-logo.svg';
import { useState } from 'react';

export default function Login(){
    // State to toggle between "Create Room" (false) and "Enter Room" (true) modes
    const [isExistingUser, setIsExistingUser] = useState(false);
    // State to track if the user has triggered verification code delivery
    const [verify, setVerify] = useState(false);

    // Handles layout toggling and resets steps to step 1
    const handleFormToggle = (e: any, isExisting: boolean) => {
        e.preventDefault(); // Stops href anchor from refreshing the web application
        setIsExistingUser(isExisting);
        setVerify(false); // Resets verification status for the new view
    };

    return(
        <div className='authPage'>
            <div className='authpage-left'>
                <img src={fulllogo} alt="logo" className="auth-logo" /> 
                
                {/* 1. Dynamic Header Prompts */}
                <p className='prompt'>
                    {isExistingUser ? 'Enter Your Experience Room' : 'Build Your Experience Room'}
                </p>
                
                {/* 2. Condition-Driven Dynamic Input Fields */}
                {!isExistingUser ? (
                    /* Build Room Layout Flow */
                    <>
                        <InputField label='Full Name' multiline={false}/>
                        <InputField label='Phone Number' multiline={false}/>
                        {verify && <InputField label='Verification Code' multiline={false}/>}
                    </>
                ) : (
                    /* Enter Room Layout Flow */
                    <>
                        <InputField label='Phone Number' multiline={false}/>
                        {verify && <InputField label='Verification Code' multiline={false}/>}
                    </>
                )}
                
                {/* 3. Adaptive CTA Action Button text */}
                <button className='verify-btn' onClick={() => setVerify(true)}>
                   {verify 
                       ? (isExistingUser ? 'Enter Room' : 'Create Room') 
                       : 'Verify'
                   }
                </button>
                
                {/* 4. Adaptive Navigation Footer Link options */}
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
