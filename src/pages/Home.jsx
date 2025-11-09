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

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "hero", ref: heroRef },
        { id: "map", ref: mapRef },
        { id: "problem", ref: problemRef },
        { id: "solution", ref: solutionRef },
        { id: "data", ref: dataRef },
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
            <h2>Memphis</h2>
            <span className="logo-subtitle">Blight Mitigation</span>
          </div>
          
          <div className="nav-links">
            <button
              className={`nav-link ${activeSection === "hero" ? "active" : ""}`}
              onClick={() => scrollToSection(heroRef)}
            >
              <span className="nav-dot"></span>
              Home
            </button>
            <button
              className={`nav-link ${activeSection === "map" ? "active" : ""}`}
              onClick={() => scrollToSection(mapRef)}
            >
              <span className="nav-dot"></span>
              Interactive Map
            </button>
            <button
              className={`nav-link ${activeSection === "problem" ? "active" : ""}`}
              onClick={() => scrollToSection(problemRef)}
            >
              <span className="nav-dot"></span>
              The Challenge
            </button>
            <button
              className={`nav-link ${activeSection === "solution" ? "active" : ""}`}
              onClick={() => scrollToSection(solutionRef)}
            >
              <span className="nav-dot"></span>
              Our Solution
            </button>
            <button
              className={`nav-link ${activeSection === "data" ? "active" : ""}`}
              onClick={() => scrollToSection(dataRef)}
            >
              <span className="nav-dot"></span>
              Data Insights
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
              <div className="hero-badge">Memphis Hackathon 2025</div>
              <h1 className="hero-title">
                Blight
                <span className="gradient-text"> Zero</span>
              </h1>
              <p className="hero-description">
                Empowering City staff and community members with advanced data analysis
                to prioritize properties for blight mitigation efforts across Memphis.
              </p>
              <div className="hero-buttons">
                <button className="btn btn-primary" onClick={() => scrollToSection(mapRef)}>
                  Explore Map
                </button>
                <button className="btn btn-secondary" onClick={() => scrollToSection(problemRef)}>
                  Learn More
                </button>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">4</div>
                  <div className="stat-label">Priority Zones</div>
                </div>
                <div className="stat">
                  <div className="stat-number">3</div>
                  <div className="stat-label">Data Sources</div>
                </div>
                <div className="stat">
                  <div className="stat-number">1000s</div>
                  <div className="stat-label">Properties Analyzed</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section ref={mapRef} className="section map-section">
          <div className="container">
            <div className="map-header-inline">
              <span className="section-label">Interactive Exploration</span>
              <h2 className="section-title">Priority Zones Map</h2>
              <p className="section-description">
                Explore highlighted zip codes (38128, 38127, 38118, 38114) showing
                areas with the highest concentration of blight indicators.
              </p>
            </div>
            <div className="map-container-box">
              <div className="map-wrapper-compact">
                <MapContainer />
                
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section ref={problemRef} className="section problem-section">
          <div className="container">
            <div className="section-header">
              <span className="section-label">The Challenge</span>
              <h2 className="section-title">Understanding Memphis' Blight Crisis</h2>
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

              <div className="problem-card">
                <div className="problem-icon">🏘️</div>
                <h3>Geographic Coverage</h3>
                <p>
                  Managing blight mitigation across Memphis' extensive service area
                  requires strategic prioritization and efficient planning.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section ref={solutionRef} className="section solution-section">
          <div className="container">
            <div className="section-header">
              <span className="section-label">Our Approach</span>
              <h2 className="section-title">Data-Driven Prioritization</h2>
              <p className="section-description">
                Combining multiple data sources to identify and prioritize high-risk areas
                for targeted blight mitigation interventions.
              </p>
            </div>

            <div className="solution-content">
              <div className="solution-features">
                <div className="feature">
                  <div className="feature-number">01</div>
                  <h3>Multi-Source Analysis</h3>
                  <p>
                    Integrating code enforcement requests, eviction data, and police
                    reports to identify patterns and predict blight risk.
                  </p>
                </div>

                <div className="feature">
                  <div className="feature-number">02</div>
                  <h3>Geographic Prioritization</h3>
                  <p>
                    Highlighting standout zip codes with concentrated issues, enabling
                    targeted resource allocation for maximum impact.
                  </p>
                </div>

                <div className="feature">
                  <div className="feature-number">03</div>
                  <h3>Interactive Visualization</h3>
                  <p>
                    Providing an intuitive map interface for City staff and community
                    members to explore data and understand local challenges.
                  </p>
                </div>

                <div className="feature">
                  <div className="feature-number">04</div>
                  <h3>Actionable Insights</h3>
                  <p>
                    Generating recommendations based on historical patterns to prevent
                    recurring issues and optimize intervention strategies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Section */}
        <section ref={dataRef} className="section data-section">
          <div className="container">
            <div className="section-header">
              <span className="section-label">Data Sources</span>
              <h2 className="section-title">Comprehensive Analysis</h2>
              <p className="section-description">
                Our solution leverages multiple data streams to provide a holistic view
                of blight patterns across Memphis.
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

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">
                <h4>Memphis Blight Mitigation</h4>
                <p>Hackathon 2025 Project</p>
              </div>
              <div className="footer-section">
                <h4>Data Sources</h4>
                <p>Code Enforcement • Evictions • Police Reports</p>
              </div>
              <div className="footer-section">
                <h4>Focus Areas</h4>
                <p>38128 • 38127 • 38118 • 38114</p>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2025 Memphis Hackathon. Built for community impact.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
  