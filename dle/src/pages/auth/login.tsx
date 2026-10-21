import './auth.css';
import InputField from '../../components/inputfield/input';
import authImg from '../../assets/authimage.svg';
import fulllogo from '../../assets/full-logo.svg';
import { useState } from 'react';

export default function Login(){
    const [verify, setVerify] = useState(false);

    return(
        <div className='authPage'>
            <div className='authpage-left'>
                <img src={fulllogo} alt="logo" className="auth-logo" /> 
                <p className='prompt'>Build Your Experience Room</p>
                
                <InputField label='Full Name' multiline={false}/>
                <InputField label='Phone Number' multiline={false}/>
                
                {verify && (
                    <InputField label='Verification Code' multiline={false}/> 
                )}
                
                <button className='verify-btn' onClick={() => setVerify(true)}>
                   {verify ? 'Create Room' : 'Verify'}
                </button>
                
                <p className='login-action'>
                    Have an existing room? <a className='login-link' href='/'>Enter Room</a>
                </p>
            </div>
            
            <div className='authpage-right'>
                <img src={authImg} alt="authimg" className='authImage' />
            </div>
        </div>
    );
}
