import './auth.css';
import InputField from '../../components/inputfield/input';
import authImg from '../../assets/authimage.svg';
import fulllogo from '../../assets/full-logo.svg';


export default function Login(){
    return(
        <div className='authPage'>
            <div className='authpage-left'>
            <img src={fulllogo} alt="authimg" /> 
            <p className='prompt'>Build Your Experience Room</p>
            <InputField label='Full Name' multiline= {false}/>
            <InputField label='Phone Number' multiline= {false}/>
            <button>
                Verify 
            </button>
            </div>
            <div className='authpage-right'>
                <img src={authImg} alt="authimg" className='authImage' />
            </div>
        </div>
    )
}