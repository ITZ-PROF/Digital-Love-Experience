import { useEffect, useRef } from "react";
import Navbar from "../../components/navbar/Navbar";
import HeroSection from "../../components/hero/HeroSection";
import DisplaySection from "../../components/display/displaysection";
import Features from "../../components/features/featuressection";
import Quote from "../../components/quote/quotesection";
import CTA from "../../components/cta/ctasection";
import Footer from "../../components/footer/footersection";
import './homepage.css';

function Homepage() {
    const homepageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const homepage = homepageRef.current;
        if (!homepage) return;

        const sections = homepage.querySelectorAll<HTMLElement>(".scroll-reveal");
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            sections.forEach((section) => section.classList.add("is-revealed"));
            return;
        }

        homepage.classList.add("motion-ready");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("is-revealed");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -8% 0px",
            }
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="homepage" ref={homepageRef}>
            <Navbar type="authenticated" />
            <div className="scroll-reveal"><HeroSection /></div>
            <div className="scroll-reveal"><DisplaySection /></div>
            <div className="scroll-reveal"><Features /></div>
            <div className="scroll-reveal"><Quote /></div>
            <div className="scroll-reveal"><CTA /></div>
            <div className="scroll-reveal"><Footer /></div>
        </div>
    );
}

export default Homepage;