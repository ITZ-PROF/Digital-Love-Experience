import './featuressection.css';


interface FeatureCardProps {
  title?: string;
  description?: string;
  imageUrl?: string;
}

function FeatureCard({ title, description, imageUrl }: FeatureCardProps) {
    return (
        <div className="feature-card">
            <p className="feature-card-text">{title}</p>
            <p className="feature-card-description">{description}</p>
            <div className="feature-card-image-container">
                <img src={imageUrl} alt={title} className="feature-card-image" />
            </div>
        </div>
    );
}

export default FeatureCard;