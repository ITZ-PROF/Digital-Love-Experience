import Navbar from "../../components/navbar/Navbar";
import HeroSection from "../../components/hero/HeroSection";
import './homepage.css';

function Homepage() {
    return (
        <div className="homepage">
            <Navbar type="authenticated" />
            <HeroSection />
        </div>
    );
}

export default Homepage;