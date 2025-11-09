import React from "react";
import MapContainer from "../components/MapContainer";
import "./home.css";

export default function Home() {
  return (
    <div className="home-root">
      <nav className="topnav">
        <div className="brand">BlightZero · Memphis</div>
        <div className="navlinks">
          <a href="#about">About</a>
          <a href="#topics">Topics</a>
          <a href="#skills">Skills</a>
          <a href="#map">Map</a>
        </div>
      </nav>

      <header className="hero" id="hero">
        <div className="hero-inner">
          <h1>Focus, prioritize, and remove blight.</h1>
          <p className="lede">
            Light is more than an eyesore; it affects the health, safety, and
            economic potential of our communities. For Hackathon 2025 we are
            building on last year's work to combine data, maps, and tools to
            help the City of Memphis and community partners identify,
            prioritize, and mitigate persistent blight.
          </p>
          <div className="hero-cta">
            <a className="btn primary" href="#map">
              See the Blight Map
            </a>
            <a className="btn ghost" href="#call">
              Join the Challenge
            </a>
          </div>
        </div>
      </header>

      <main className="content">
        <section id="about" className="card">
          <h2>Why this matters</h2>
          <p>
            Neighborhood cleanliness and fighting blight are ongoing
            responsibilities for the City of Memphis — particularly for
            divisions like Solid Waste, Public Works, 311, and Community
            Enhancement. Our Property Hub and new tools help expose ownership,
            vacancy, and evictions so City staff and community members can act
            faster and smarter.
          </p>
        </section>

        <section id="call" className="card">
          <h2>Call to Action</h2>
          <p>
            For our 2025 Hackathon we want ideas that help prioritize properties
            and allocate limited resources where they’ll have the most impact.
            Think about repeated issues, multiple data sources beyond 311,
            and ways to surface properties that need continued attention.
          </p>
        </section>

        <section id="topics" className="card">
          <h2>Potential Hackathon Topics</h2>
          <ul>
            <li>
              Identifying geographic areas, property types, and trends the City
              should prioritize for service based on data and mapping
            </li>
            <li>
              Creating a blight index or predictive indicators for where
              properties may be susceptible to blight-related issues
            </li>
            <li>
              Mining new datasets beyond 311 (automated flags from imagery,
              business rating trends, landlord histories)
            </li>
            <li>Designing dashboard or data-report wireframes for city staff</li>
          </ul>
        </section>

        <section id="skills" className="card">
          <h2>Hacker Skill Sets Needed</h2>
          <div className="skills-grid">
            <div>Data analysis / Data science</div>
            <div>GIS & Mapping</div>
            <div>Data visualization / BI</div>
            <div>App & Web tool development</div>
            <div>Project management</div>
            <div>Performance management</div>
          </div>
        </section>

        <section id="map" className="map-section">
          <div className="map-shell">
            {/* Map fills this area. MemphisMap returns the map container. */}
            <MapContainer />
            <div className="map-overlay">
              <div className="overlay-card">
                <h3>Property Hub — Blight Insights</h3>
                <p>
                  Use the map to explore ownership, vacancy, and evictions. Use
                  the filters in the Property Hub to find clusters and
                  prioritize action.
                </p>
                <a className="btn small" href="#call">
                  Start a Project
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          © {new Date().getFullYear()} Innovate Memphis · City of Memphis
        </div>
        <div>
          <a href="#about">About</a>
          <a href="#map">Map</a>
        </div>
      </footer>
    </div>
  );
}
