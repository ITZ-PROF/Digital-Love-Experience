import Navbar from "../../components/navbar/Navbar";
import HeroSection from "../../components/hero/HeroSection";
import DisplaySection from "../../components/display/displaysection";
import './homepage.css';

function Homepage() {
    return (
        <div className="homepage">
            <Navbar type="authenticated" />
            <HeroSection />
            <DisplaySection />
        </div>
    );
}

export default Homepage;