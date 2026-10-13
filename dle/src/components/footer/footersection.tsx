import './footer.css';
import x from '../../assets/x.svg';
import ig from '../../assets/ig.svg';
import fb from '../../assets/fb.svg';

function Footer(){
    return(
        <div>
           <div>

           </div>
           <div className='lower-footer-section'>
            <p>
© 2026 DLE. All rights reserved.
            </p>
            <ul className='icon-list'>
                <li>
                    <img src={ig}/>
                </li>
                <li>
                     <img src={x}/>
                </li>
                <li>
                     <img src={fb}/>
                </li>
            </ul>
           </div>
        </div>
    )
}

export default Footer;