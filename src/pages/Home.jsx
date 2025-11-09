import React, { useState, useEffect, useRef } from "react";
import MapContainer from "../components/MapContainer";
import "./home.css";

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const [lightboxImage, setLightboxImage] = useState(null);
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
        { id: "data", ref: dataRef }, // moved "data" up so order matches the DOM (data appears before solution)
        { id: "solution", ref: solutionRef },
        { id: "nextSteps", ref: nextStepsRef },
      ];

      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        if (section.ref.current) {
          const { offsetTop, offsetHeight } = section.ref.current;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
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
              className={`nav-link ${
                activeSection === "problem" ? "active" : ""
              }`}
              onClick={() => scrollToSection(problemRef)}
            >
              <span className="nav-dot"></span>
              Understanding the Problem
            </button>

            {/* moved "Looking in to the future" up (data) */}
            <button
              className={`nav-link ${activeSection === "data" ? "active" : ""}`}
              onClick={() => scrollToSection(dataRef)}
            >
              <span className="nav-dot"></span>
              Goal
            </button>

            <button
              className={`nav-link ${
                activeSection === "solution" ? "active" : ""
              }`}
              onClick={() => scrollToSection(solutionRef)}
            >
              <span className="nav-dot"></span>
              Recognizing a pattern
            </button>

            <button
              className={`nav-link ${
                activeSection === "nextSteps" ? "active" : ""
              }`}
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
              <div className="hero-buttons"></div>
              <p className="hero-description">
                Empowering City staff and community members with advanced data
                analysis to prioritize properties for blight mitigation efforts
                across Memphis.
              </p>
              <div className="hero-buttons"></div>
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
              <h2 className="section-title">Limited Foresight</h2>
              <p className="section-description">
                With a large geographic service area and finite resources,
                Memphis faces significant challenges in effectively prioritizing
                blight mitigation efforts.
              </p>
            </div>

            <div className="problem-grid">
              <div className="problem-card">
                <div className="problem-icon"></div>
                <h3>Recurring Blight</h3>
                <p>
                  Problem properties where the same issues happen repeatedly,
                  including illegal dumping piles and high weeds/grass in vacant
                  lots.
                </p>
              </div>

              <div className="problem-card">
                <div className="problem-icon"></div>
                <h3>Multiple Data Sources</h3>
                <p>
                  Exhaustive data sets that don't always integrate seamlessly,
                  creating challenges in developing a comprehensive
                  prioritization system.
                </p>
              </div>
              <div className="problem-card">
                <div className="problem-icon"></div>
                <h3>Resource Allocation</h3>
                <p>
                  Difficulties in allocating resources and prioritizing
                  neighborhoods when future blight patterns cannot be accurately
                  anticipated.
                </p>
              </div>
              <div className="hero-buttons"></div>
            </div>
          </div>
        </section>

        {/* Data Section */}
        {/* Data Section */}
        <section ref={dataRef} className="section data-section">
          <div className="container">
            <div className="section-header">
              <span className="section-label">Goal</span>
              <h2 className="section-title">Blight Foresight Blueprint</h2>
              <p className="section-description">
                Our goal is to turn disconnected events into early warnings and
                then into actionable priorities for Memphis — so we can
                intervene before blight takes root.
              </p>
            </div>

            {/* --- helpers local to this component scope --- */}
            {/* Compact node-set with guaranteed spacing (no overlap) */}
            <div style={{ display: "none" }} />
            {(() => {
              const NodeCluster = ({ connected = false, size = 110 }) => {
                // triangle layout (no overlap)
                const r = 18; // node radius (px)
                const cx = size / 2;
                const cyTop = 24;
                const cyBottom = size - 22;

                // three anchor points (triangle)
                const P1 = { x: cx, y: cyTop };
                const P2 = { x: cx - 32, y: cyBottom };
                const P3 = { x: cx + 32, y: cyBottom };

                const nodes = [
                  { ...P1, emoji: "🚓" },
                  { ...P2, emoji: "🏚️" },
                  { ...P3, emoji: "📄" },
                ];

                return (
                  <div
                    style={{
                      position: "relative",
                      width: size,
                      height: size,
                      minWidth: size,
                      flexShrink: 0,
                    }}
                    aria-hidden
                  >
                    {/* connectors for Step 2 */}
                    {connected && (
                      <svg
                        width={size}
                        height={size}
                        style={{
                          position: "absolute",
                          inset: 0,
                          pointerEvents: "none",
                          opacity: 0.7,
                        }}
                      >
                        <defs>
                          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                            <stop
                              offset="0%"
                              stopColor="rgba(255,255,255,0.2)"
                            />
                            <stop
                              offset="50%"
                              stopColor="rgba(255,255,255,0.55)"
                            />
                            <stop
                              offset="100%"
                              stopColor="rgba(255,255,255,0.2)"
                            />
                          </linearGradient>
                        </defs>
                        <line
                          x1={P1.x}
                          y1={P1.y}
                          x2={P2.x}
                          y2={P2.y}
                          stroke="url(#g)"
                          strokeWidth="2"
                        />
                        <line
                          x1={P1.x}
                          y1={P1.y}
                          x2={P3.x}
                          y2={P3.y}
                          stroke="url(#g)"
                          strokeWidth="2"
                        />
                        <line
                          x1={P2.x}
                          y1={P2.y}
                          x2={P3.x}
                          y2={P3.y}
                          stroke="url(#g)"
                          strokeWidth="2"
                        />
                      </svg>
                    )}

                    {nodes.map((n, i) => (
                      <div
                        key={i}
                        style={{
                          position: "absolute",
                          left: n.x - r - 10,
                          top: n.y - r - 6,
                          width: r * 2 + 20,
                          height: r * 2 + 12,
                          display: "grid",
                          placeItems: "center",
                          borderRadius: 12,
                          background: connected
                            ? "rgba(255,255,255,0.10)"
                            : "rgba(255,255,255,0.06)",
                          border: connected
                            ? "1px solid rgba(255,255,255,0.22)"
                            : "1px solid rgba(255,255,255,0.12)",
                          boxShadow: connected
                            ? "0 4px 18px rgba(255,255,255,0.08)"
                            : "none",
                          fontSize: 22,
                        }}
                      >
                        {n.emoji}
                      </div>
                    ))}
                  </div>
                );
              };

              return (
                <div
                  style={{
                    maxWidth: 880,
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 28,
                  }}
                >
                  {/* STEP 1: Unconnected Events */}
                  <div
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 16,
                      padding: "18px 18px",
                    }}
                  >
                    <div
                      style={{ display: "flex", gap: 16, alignItems: "center" }}
                    >
                      {/* LEFT: spaced, unconnected nodes */}
                      <NodeCluster connected={false} />

                      {/* RIGHT: text */}
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 999,
                              display: "grid",
                              placeItems: "center",
                              background: "rgba(255,255,255,0.08)",
                              border: "1px solid rgba(255,255,255,0.16)",
                              fontSize: 18,
                              flexShrink: 0,
                            }}
                            aria-hidden
                          >
                            1
                          </div>
                          <div style={{ fontWeight: 700, fontSize: 20 }}>
                            Unconnected Events
                          </div>
                        </div>
                        <div style={{ opacity: 0.85, marginTop: 6 }}>
                          Evictions, police incidents, and minor violations
                          appear unrelated when seen in isolation.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* down arrow connector */}
                  <div style={{ fontSize: 24, opacity: 0.8 }} aria-hidden>
                    ⬇
                  </div>

                  {/* STEP 2: Interconnected Trends (no timeline bar; nodes to the left; connected) */}
                  <div
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.16)",
                      borderRadius: 16,
                      padding: "18px 18px",
                    }}
                  >
                    <div
                      style={{ display: "flex", gap: 16, alignItems: "center" }}
                    >
                      {/* LEFT: connected nodes (with lines) */}
                      <NodeCluster connected={true} />

                      {/* RIGHT: text */}
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 999,
                              display: "grid",
                              placeItems: "center",
                              background: "rgba(255,255,255,0.1)",
                              border: "1px solid rgba(255,255,255,0.2)",
                              fontSize: 18,
                              flexShrink: 0,
                            }}
                            aria-hidden
                          >
                            2
                          </div>
                          <div style={{ fontWeight: 700, fontSize: 20 }}>
                            Interconnected Trends
                          </div>
                        </div>
                        <div style={{ opacity: 0.85, marginTop: 6 }}>
                          Combine events over time → patterns emerge — early
                          signals of neighborhood stress.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* down arrow connector */}
                  <div style={{ fontSize: 24, opacity: 0.8 }} aria-hidden>
                    ⬇
                  </div>

                  {/* STEP 3: Predictive Prioritization (unchanged) */}
                  <div
                    style={{
                      width: "100%",
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
                      border: "1px solid rgba(255,255,255,0.22)",
                      borderRadius: 16,
                      padding: "20px",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 14 }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 999,
                          display: "grid",
                          placeItems: "center",
                          background: "rgba(255,255,255,0.14)",
                          border: "1px solid rgba(255,255,255,0.28)",
                          fontSize: 18,
                        }}
                        aria-hidden
                      >
                        3
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 20 }}>
                          Predictive Prioritization
                        </div>
                        <div style={{ opacity: 0.85 }}>
                          Identify neighborhoods on the cusp of deterioration
                          and prioritize proactive action.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* Solution Section */}
        <section ref={solutionRef} className="section solution-section">
          <div className="container">
            <div className="section-header">
              <span className="section-label">Recognizing a pattern</span>
              <h2 className="section-title">
                How Our Algorithm Predicts Blight
              </h2>
              <p className="section-description">
                We have developed an algorithm which searches through different
                combinations of metrics to find what parameters can best be used
                to predict blight trends.
              </p>
            </div>

            <div className="plots-gallery">
              <div
                className="plot-card"
                onClick={() =>
                  setLightboxImage({
                    src: "/images/plots/evictions_pie_chart.png",
                    alt: "Evictions Distribution",
                    title: "Evictions by Category",
                  })
                }
                style={{ cursor: "pointer" }}
              >
                <img
                  src="/images/plots/evictions_pie_chart.png"
                  alt="Evictions Distribution"
                />
                <h3>Evictions by Category</h3>
                <p>
                  Distribution of evictions filed across Memphis neighborhoods.
                </p>
              </div>

              <div
                className="plot-card"
                onClick={() =>
                  setLightboxImage({
                    src: "/images/plots/police_crime_categories_pie_chart.png",
                    alt: "Crime Categories",
                    title: "Crime Category Breakdown",
                  })
                }
                style={{ cursor: "pointer" }}
              >
                <img
                  src="/images/plots/police_crime_categories_pie_chart.png"
                  alt="Crime Categories"
                />
                <h3>Crime Category Breakdown</h3>
                <p>
                  Distribution of different crime types which were used as
                  parameters in the search algorithm.
                </p>
              </div>

              <div
                className="plot-card"
                onClick={() =>
                  setLightboxImage({
                    src: "/images/plots/code_enforcement_pie_chart.png",
                    alt: "Code Enforcement Categories",
                    title: "Enforcement Types",
                  })
                }
                style={{ cursor: "pointer" }}
              >
                <img
                  src="/images/plots/code_enforcement_pie_chart.png"
                  alt="Code Enforcement Categories"
                />
                <h3>Enforcement Types</h3>
                <p>
                  Distribution of code enforcment requests used to estimate
                  blight patters.
                </p>
              </div>
            </div>
          </div>
        </section>

        <br />

        <div className="map-header-inline">
          <br />
        </div>

        <div className="map-container-box">
          <div className="map-wrapper-compact">
            <MapContainer />
          </div>
        </div>

        {/* Next Steps Section */}
        <section ref={nextStepsRef} className="section solution-section">
          <div className="container">
            <div className="section-header">
              <span className="section-label">Next steps</span>
              <h2 className="section-title">Moving Forward</h2>
              <p className="section-description">
                Expanding our predictive algorithm to create actionable
                predictions specific to Memphis's blight mitigation efforts.
              </p>
            </div>

            <div className="solution-content">
              <div className="solution-features">
                <div className="feature">
                  <div className="feature-number">01</div>
                  <h3>Expanding Data Set</h3>
                  <p>
                    Include data from all Memphis districts and more local
                    databases with different information to find specific
                    predictors with less error.
                  </p>
                </div>

                <div className="feature">
                  <div className="feature-number">02</div>
                  <h3>Implment Preventative Measures</h3>
                  <p>
                    Use predictions to guide proactive blight mitigation
                    strategies, reducing the incidence of blight before it
                    occurs.
                  </p>
                </div>

                <div className="feature">
                  <div className="feature-number">03</div>
                  <h3>Investigate Causes of Blight</h3>
                  <p>
                    Use insights from the predictive model to guide research
                    into the root causes of blight in Memphis neighborhoods.
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
              <div className="footer-section"></div>
              <div className="footer-section"></div>
              <div className="footer-section"></div>
            </div>
            <div className="footer-bottom"></div>
          </div>
        </footer>
      </main>

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10001,
            padding: "2rem",
            animation: "fadeIn 0.3s ease-out",
            cursor: "pointer",
          }}
          onClick={() => setLightboxImage(null)}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "90vh",
              animation: "zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              style={{
                position: "absolute",
                top: "-50px",
                right: "0",
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "#ffffff",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(255, 255, 255, 0.3)")
              }
              onMouseLeave={(e) =>
                (e.target.style.background = "rgba(255, 255, 255, 0.2)")
              }
            >
              ✕ Close
            </button>
            <img
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              style={{
                maxWidth: "100%",
                maxHeight: "85vh",
                objectFit: "contain",
                borderRadius: "12px",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
              }}
            />
            <h3
              style={{
                color: "#ffffff",
                textAlign: "center",
                marginTop: "1rem",
                fontSize: "1.5rem",
              }}
            >
              {lightboxImage.title}
            </h3>
          </div>
          <style>{`
            @keyframes zoomIn {
              from {
                opacity: 0;
                transform: scale(0.5);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
