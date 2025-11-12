function Zip38118() {
  return (
    <div style={{ lineHeight: 1.6 }}>
      {/* Top Section: Title/Description Left, Detailed Text Right (swapped) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 560px",
          gap: "2rem",
          marginBottom: "2rem",
          alignItems: "start",
        }}
      >
        {/* Left: Title and Short Description */}
        <div>
          <h2
            style={{
              marginTop: 0,
              fontSize: "2rem",
              marginBottom: "1rem",
              color: "#ffffff",
            }}
          >
            Parkway Village & Oakville
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#a0a0b2",
              lineHeight: 1.7,
              marginBottom: "1.5rem",
            }}
          >
            Parkway Village & Oakville (ZIP 38118) has been flagged by our
            near-term blight predictor. The model finds strong, recent
            correlations between several leading indicators, including
            eviction filings, police incident density, and repeated code
            enforcement complaints that together signal an elevated risk of
            property decline and neighborhood-level blight in the coming
            months.
          </p>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              padding: "1rem",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            <h4
              style={{
                marginTop: 0,
                marginBottom: "0.75rem",
                color: "#ffffff",
              }}
            >
              Key Indicators
            </h4>
            <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#a0a0b2" }}>
              <li>Elevated eviction rates correlating with property neglect</li>
              <li>Increased police incidents in vacant property areas</li>
              <li>High frequency of code enforcement violations</li>
              <li>Declining property maintenance patterns</li>
            </ul>
          </div>
        </div>

        {/* Right: Larger Text Box (moved up) */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "12px",
            padding: "1.25rem",
            marginTop: "0",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: "1rem",
              fontSize: "1.25rem",
              color: "#ffffff",
            }}
          >
            Detailed Analysis & Recommendations
          </h3>

          <div
            style={{ fontSize: "0.95rem", color: "#d0d0e0", lineHeight: 1.7 }}
          >
            <h4
              style={{
                color: "#ffffff",
                marginTop: "0",
                marginBottom: "0.5rem",
              }}
            >
              Why the model flagged this neighborhood
            </h4>
            <p>
              Our predictor aggregates temporal and spatial signals across
              multiple public datasets. For ZIP 38118 we see concentrated
              eviction filings, overlapping clusters of police incidents, and a
              high rate of repeated code enforcement cases. These factors are
              part of the predictor categories we use (examples listed below),
              and when they co-occur the model assigns a higher short-term
              blight risk score.
            </p>






            <h4
              style={{
                color: "#ffffff",
                marginTop: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              Practical responses and low-risk interventions
            </h4>
            <p>
              Early, targeted actions can greatly reduce the chance of sustained
              blight. Examples local agencies and community partners can use:
            </p>
            <ul style={{ color: "#d0d0e0" }}>
              <li>
                Route extra city personnel (code inspectors, sanitation crews,
                outreach workers) on recurring patrol loops through the flagged
                blocks to catch violations early and remove hazards.
              </li>
              <li>
                Prioritize proactive property inspections where eviction filings
                and police incidents overlap to identify at-risk parcels.
              </li>
              <li>
                Coordinate eviction prevention and tenant support services to
                reduce vacancy turnover that precedes blight.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Now show the image as a full-width card below (swapped) */}
      <div
        style={{
          marginTop: "1.5rem",
          background: "rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          padding: "1rem",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
        }}
      >
        <img
          src="/images/plots/Parkway_Village_predictors_vs_blight.png"
          alt="Parkway Village Analysis"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "80vh",
            objectFit: "contain",
            borderRadius: "12px",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "0.75rem",
          }}
        >
          <h3 style={{ margin: 0, color: "#ffffff" }}>Parkway Village </h3>
          <p style={{ margin: 0, color: "#a0a0b2" }}>
            Predictor correlation analysis
          </p>
        </div>
      </div>
    </div>
  );
}

export default Zip38118;
