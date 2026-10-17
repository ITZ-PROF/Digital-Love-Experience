import './featuressection.css';
import FeatureCard from './featurecard';
import icon from '../../../src/assets/icon.svg'
import gift from '../../../src/assets/gift.svg'
import share from '../../../src/assets/share.svg'
import envelope from '../../../src/assets/envelope.svg'

function Features() {
    return (
        <div className="features">
            <p className="features-text">Everything You Need for Any Special Moment</p>
            <div className="features-cards">
                <FeatureCard 
                     title= {<p className='feature-card-text'>Personal <br/>Messages</p>}
                     description={<p  className='feature-card-description'>Write heartfelt notes that feel <br/>personal for any special <br/>moment.</p>}
                    imageUrl= {<img src={envelope} className="feature-card-image"  />}
                />
                <FeatureCard 
                     title= {<p className='feature-card-text'>Any <br/>Occasion</p>}
                     description={<p className='feature-card-description'>Create a meaningful page <br/>for birthdays, anniversaries, graduations, apologies, and more.</p>}
                    imageUrl= {<img src={gift} className="feature-card-image"  />}
                />
                <FeatureCard 
                    title= {<p className='feature-card-text'>Photo <br/>Memories</p>}
                     description={<p className='feature-card-description'>Add your favorite photos and<br/> videos to make the moment feel real.</p>} 
                    imageUrl= {<img src={icon} className="feature-card-image"  />}
                />
                <FeatureCard 
                     title= {<p className='feature-card-text'>Instant <br/>Sharing</p>}
                     description={<p className='feature-card-description'>Send a unique link so they<br/> can open it instantly from anywhere.</p>}
                    imageUrl= {<img src={share} className="feature-card-image"  />}
                />
            </div>
        </div>
    );
}

export default Features;
