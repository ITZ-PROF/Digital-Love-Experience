import './featuressection.css';
import FeatureCard from './featurecard';

function Features() {
    return (
        <div className="features">
            <p className="features-text">Everything You Need for Any Special Moment</p>
            <div className="features-cards">
                <FeatureCard 
                    title="Personal Messages" 
                    description="Description for Feature 1" 
                    imageUrl="/path/to/feature1.jpg" 
                />
                <FeatureCard 
                    title="Any Occasion" 
                    description="Description for Feature 2" 
                    imageUrl="/path/to/feature2.jpg" 
                />
                <FeatureCard 
                    title="Photo Memories" 
                    description="Description for Feature 3" 
                    imageUrl="/path/to/feature3.jpg" 
                />
                <FeatureCard 
                    title="Instant sharing" 
                    description="Description for Feature 3" 
                    imageUrl="/path/to/feature3.jpg" 
                />
            </div>
        </div>
    );
}

export default Features;