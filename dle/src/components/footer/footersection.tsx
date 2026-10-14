import './footer.css';
import x from '../../assets/x.svg';
import ig from '../../assets/ig.svg';
import fb from '../../assets/fb.svg';
import logo_variant_1 from '../../assets/logo_variant_1.svg';

function Footer(){
    return(
        <div>
           <div className='upper-footer-section'>
            <div className='upper-footer-section-start'>
                <img src={logo_variant_1}/>
                <p>Every moment deserves its own page.</p>
            </div>
            <div className='upper-footer-section-mid'>
                <ul className='upper-footer-section-mid-list'>
                    <li className='list-header'>Products</li>
                    <li><a href='#'>Features</a></li>
                    <li><a href='#'>Pricing</a></li>
                    <li><a href='#'>Templates</a></li>
                    <li><a href='#'>Examples</a></li>
                </ul>
            </div>
            <div className='upper-footer-section-end'> 
                <ul className='upper-footer-section-end-list'>
                    <li className='list-header'>Support</li>
                    <li><a href='#'>Privacy Center</a></li>
                    <li><a href='#'>Privacy Policy</a></li>
                </ul>
            </div>

           </div>
           <div className='lower-footer-section'>
            <p style={{color: '#710505'}}>
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