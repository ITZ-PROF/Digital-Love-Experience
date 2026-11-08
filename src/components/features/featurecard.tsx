import { ReactNode, CSSProperties } from 'react';
import './featuressection.css';


interface FeatureCardProps {
  title?: ReactNode
  description?: ReactNode;
  imageUrl?: ReactNode;
  cardStyle?: string;
  imgStyles? : CSSProperties
}

function FeatureCard({ title, description, imageUrl, imgStyles }: FeatureCardProps) {
    return (
        <div className="feature-card" style={imgStyles}>
            
            <div className="feature-card-image-container">
                {imageUrl}
            </div>
           {title}
           {description}
        </div>
    );
}

export default FeatureCard;