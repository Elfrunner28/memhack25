import React, { useState, useEffect, useRef } from "react";
import MapContainer from "../components/MapContainer";
import "./home.css";

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const heroRef = useRef(null);
  const problemRef = useRef(null);
  const solutionRef = useRef(null);
  const mapRef = useRef(null);
  const dataRef = useRef(null);
  const nextStepsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "hero", ref: heroRef },
        { id: "problem", ref: problemRef },
        { id: "solution", ref: solutionRef },
        { id: "data", ref: dataRef },
        { id: "nextSteps", ref: nextStepsRef },
      ];

      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        if (section.ref.current) {
          const { offsetTop, offsetHeight } = section.ref.current;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <nav className="sidebar">
        <div className="sidebar-content">
          <div className="logo">
            <h2>Progress</h2>
            <span className="logo-subtitle">Blight Mitigation</span>
          </div>
          
          <div className="nav-links">
            <button
              className={`nav-link ${activeSection === "hero" ? "active" : ""}`}
              onClick={() => scrollToSection(heroRef)}
            >
              <span className="nav-dot"></span>
              Intro
            </button>
            <button
              className={`nav-link ${activeSection === "problem" ? "active" : ""}`}
              onClick={() => scrollToSection(problemRef)}
            >
              <span className="nav-dot"></span>
              Understanding the Problem
            </button>
            <button
              className={`nav-link ${activeSection === "solution" ? "active" : ""}`}
              onClick={() => scrollToSection(solutionRef)}
            >
              <span className="nav-dot"></span>
              Recognizing a pattern
            </button>
            <button
              className={`nav-link ${activeSection === "data" ? "active" : ""}`}
              onClick={() => scrollToSection(dataRef)}
            >
              <span className="nav-dot"></span>
              Looking in to the future
            </button>
            <button
              className={`nav-link ${activeSection === "nextSteps" ? "active" : ""}`}
              onClick={() => scrollToSection(nextStepsRef)}
            >
              <span className="nav-dot"></span>
              Next steps
            </button>
          </div>

          <div className="sidebar-footer">
            <p>Memphis Hackathon 2025</p>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <section ref={heroRef} className="section hero-section">
          <div className="container">
            <div className="hero-content">
              <div className="hero-badge">Innovate Memphis Hackathon 2025</div>
              <h1 className="hero-title">
                Blight
                <span className="gradient-text"> Predictor</span>
              </h1>
                            <div className="hero-buttons">
              </div>
              <p className="hero-description">
                Empowering City staff and community members with advanced data analysis
                to prioritize properties for blight mitigation efforts across Memphis.
              </p>
              <div className="hero-buttons">
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">3</div>
                  <div className="stat-label">Data Sources</div>
                </div>
                <div className="stat">
                  <div className="stat-number">30,604</div>
                  <div className="stat-label">Data Entries</div>
                </div>
                <div className="stat">
                  <div className="stat-number">4,853</div>
                  <div className="stat-label">Properties Analyzed</div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Problem Section */}
        <section ref={problemRef} className="section problem-section">
          <div className="container">
            <div className="section-header">
              <span className="section-label">Understanding the Problem</span>
              <h2 className="section-title">There's No Stopping It</h2>
              <p className="section-description">
                With a large geographic service area and finite resources, Memphis faces
                significant challenges in effectively prioritizing blight mitigation efforts.
              </p>
            </div>

            <div className="problem-grid">
              <div className="problem-card">
                <div className="problem-icon">🔄</div>
                <h3>Recurring Issues</h3>
                <p>
                  Problem properties where the same issues happen repeatedly, including
                  illegal dumping piles and high weeds/grass in vacant lots.
                </p>
              </div>

              <div className="problem-card">
                <div className="problem-icon">📊</div>
                <h3>Multiple Data Sources</h3>
                <p>
                  Challenge of integrating various data sources beyond 311 service
                  requests to create a comprehensive prioritization system.
                </p>
              </div>
              <div className="problem-card">
                <div className="problem-icon">🎯</div>
                <h3>Resource Allocation</h3>
                <p>
                  Need for proper allocation of finite resources based on which
                  properties, communities, and property owners indicate recurring problems.
                </p>
              </div>
              <div className="hero-buttons">
                </div>       
            </div>
              <div className="problem-card">
              <div className="problem-icon">🏘️</div>
              <h3>Geographic Coverage</h3>
              <p>
                Managing blight mitigation across Memphis' extensive service area
                requires strategic prioritization and efficient planning.
              </p>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section ref={solutionRef} className="section solution-section">
          <div className="container">
            <div className="section-header">
              <span className="section-label">Recognizing a pattern</span>
              <h2 className="section-title">How Our Algorithm Predicts Blight</h2>
              <p className="section-description">
                We have an algorithm that shows how we can prevent blight by looking at other data sources 
                to identify patterns and predict high-risk areas before they become critical.
              </p>
            </div>
          
            <br />

            <div className="map-header-inline">
              <br />


            </div>
            
            <div className="map-container-box">
              <div className="map-wrapper-compact">
                <MapContainer />
                
              </div>
            </div>
          </div>
        </section>


        {/* SLIDESHOWHERE */}
                

        {/* Data Section */}
        <section ref={dataRef} className="section data-section">
          <div className="container">
            <div className="section-header">
              <span className="section-label">Looking in to the future</span>
              <h2 className="section-title">Predictive Insights</h2>
              <p className="section-description">
                By analyzing historical patterns across multiple data sources, we can predict 
                and prevent future blight before it emerges.
              </p>
            </div>

            <div className="data-grid">
              <div className="data-card">
                <div className="data-icon">🏛️</div>
                <h3>Code Enforcement</h3>
                <p>Historical code enforcement requests revealing recurring violations and problem properties.</p>
                <div className="data-stat">10,000+ Records</div>
              </div>

              <div className="data-card">
                <div className="data-icon">📋</div>
                <h3>Eviction Data</h3>
                <p>Eviction patterns indicating housing instability and potential abandonment risks.</p>
                <div className="data-stat">5,000+ Cases</div>
              </div>

              <div className="data-card">
                <div className="data-icon">👮</div>
                <h3>Police Reports</h3>
                <p>Crime data highlighting areas requiring additional attention and community support.</p>
                <div className="data-stat">15,000+ Reports</div>
              </div>
            </div>

            <div className="cta-section">
              <h3>Ready to Make an Impact?</h3>
              <p>
                This tool helps Memphis prioritize resources effectively, ensuring that
                City staff and community members can work together to address blight
                where it matters most.
              </p>
              <button className="btn btn-primary" onClick={() => scrollToSection(mapRef)}>
                Explore the Map
              </button>
            </div>
          </div>
        </section>

        {/* Next Steps Section */}
        <section ref={nextStepsRef} className="section solution-section">
          <div className="container">
            <div className="section-header">
              <span className="section-label">Next steps</span>
              <h2 className="section-title">Moving Forward</h2>
              <p className="section-description">
                Building on our predictive algorithm to create actionable solutions 
                for Memphis' blight mitigation efforts.
              </p>
            </div>

            <div className="solution-content">
              <div className="solution-features">
                <div className="feature">
                  <div className="feature-number">01</div>
                  <h3>Enhanced Data Integration</h3>
                  <p>
                    Expand our algorithm to incorporate additional data sources and 
                    improve prediction accuracy for early intervention.
                  </p>
                </div>

                <div className="feature">
                  <div className="feature-number">02</div>
                  <h3>Real-Time Monitoring</h3>
                  <p>
                    Develop a system for continuous monitoring and alerts to help 
                    City staff respond quickly to emerging blight patterns.
                  </p>
                </div>

                <div className="feature">
                  <div className="feature-number">03</div>
                  <h3>Community Engagement</h3>
                  <p>
                    Create tools for residents to report concerns and participate 
                    in neighborhood improvement initiatives.
                  </p>
                </div>

                <div className="feature">
                  <div className="feature-number">04</div>
                  <h3>Resource Optimization</h3>
                  <p>
                    Implement automated resource allocation recommendations to maximize 
                    the impact of blight mitigation programs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">

              </div>
              <div className="footer-section">

              </div>
              <div className="footer-section">

              </div>
            </div>
            <div className="footer-bottom">
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
  