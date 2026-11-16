import './auth.css';
import InputField from '../../components/inputfield/input';
import authImg from '../../assets/authimage.svg';
import fulllogo from '../../assets/full-logo.svg';
import { useEffect, useState } from 'react';
import { useAuth } from '../../stores/authstore';
import { useNavigate } from 'react-router-dom';
import LoadingPage from '../../components/loadingpage/loader'; // 1. Import your loader component
import { useLogin, useRegister } from '../../hooks/use-auth';


export default function Login(){
    const navigate = useNavigate();
    const authenticated = useAuth((state) => state.authenticated);
    const setAuthenticated = useAuth((state) => state.setAuthenticated);
    
    const [loading, setLoading] = useState(false);
    const [isExiting, setIsExiting] = useState(false); // 2. State to handle the 700ms smooth fade out
    const [isExistingUser, setIsExistingUser] = useState(false);
    const [verify, setVerify] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]= useState('')


    const { 
        mutate: signUpMutate, 
        isPending: signUpPending, 
        error: signUpError, 
        isError: signUpIsError
     } = useRegister();


    const { 
        mutate: loginMutate, 
        isPending: loginPending, 
        error: loginError, 
        isError: loginIsError
     } = useLogin();

    // Handles layout toggling and resets steps to step 
    const handleFormToggle = (e: any, isExisting: boolean) => {
        e.preventDefault(); 
        setIsExistingUser(isExisting);
        setVerify(false); 
    };

    // 3. Form Submission Action (Triggers when final code is verified)
    const verifySignUp = () => {

    
       setLoading(true); // Show loader immediately on button click
      signUpMutate({
            fullName,
            email,
            password
        });

        if(signUpPending) {
            setLoading(true); // Show loader while waiting for the mutation to complete
            setIsExiting(false); // Reset exit state for the loader
        }else if(signUpIsError) {
            setLoading(false);
            setError(signUpError.message)
            console.error('Error during authentication:', signUpError);
        }
         setTimeout(() => {
          setLoading(false);
            setIsExiting(true); // Trigger exit animation
            setAuthenticated(true); // Update Zustand global state
         
            navigate('/')
        
        }, 2000);

    };
    const verifyLogin = () => {

    
       setLoading(true); // Show loader immediately on button click
      loginMutate({
            email,
            password
        });

        if(loginPending) {
            setLoading(true); // Show loader while waiting for the mutation to complete
            setIsExiting(false); // Reset exit state for the loader
        }else if(loginIsError) {
            setLoading(false);
            setError(loginError.message)
            console.error('Error during authentication:', loginError);
        }
         setTimeout(() => {
          setLoading(false);
            setIsExiting(true); // Trigger exit animation
            setAuthenticated(true); // Update Zustand global state
         
            navigate('/')
        
        }, 2000);

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
                        <InputField label='Full Name' multiline={false}
                         value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        <InputField label='Email' multiline={false} 
                         value={email} onChange={(e) => setEmail(e.target.value)} />
                        <InputField label='Password' multiline={false}
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                        {verify && <InputField label='Verification Code' multiline={false}/>}
                    </>
                ) : (
                    <>
                        <InputField label='Email' multiline={false}
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                        <InputField label='Password' multiline={false}
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                        {verify && <InputField label='Verification Code' multiline={false}/>}
                    </>
                )}
                
                {/* Adaptive CTA Action Button text */}
                <button className='verify-btn' 
                    //  onClick={!verify ? () => setVerify(true) : verifyAuth}
                    onClick={isExistingUser ? verifyLogin : verifySignUp}
                >
                   {/* {verify 
                       ? (isExistingUser ? 'Enter Room' : 'Create Room') 
                       : 'Verify'
                   } */}
                   {
                     isExistingUser ? 'Enter Room' : 'Create Room'
                   }
                </button>
                {
                    error && <p className='error-message'>Error: {error}</p>
                }
                
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
