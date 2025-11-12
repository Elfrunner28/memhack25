function Zip38127() {
  return (
    <div style={{ lineHeight: 1.6 }}>
      {/* Top Section: Title/Description Left, Detailed Text Right (copied from 38118 format) */}
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
            Frayser
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#a0a0b2",
              lineHeight: 1.7,
              marginBottom: "1.5rem",
            }}
          >
            Frayser (ZIP 38127) is identified by our near-term blight predictor
            as showing strong co-occurrence of stressors that historically
            precede property decline. The model highlights overlapping spikes
            in eviction activity, police incident clustering, and repeat code
            enforcement entries, a combination associated with accelerated
            neighborhood deterioration.
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
              <li>Concentrated clusters of repeat code violations</li>
              <li>Rising vacancy rates linked to eviction patterns</li>
              <li>Correlation between crime hotspots and property decline</li>
              <li>Accelerating deterioration in targeted zones</li>
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
              The predictor integrates time-series signals from police reports,
              eviction filings, and code enforcement cases. For Frayser we are
              seeing those signals cluster spatially, a pattern that elevates
              the short-term blight risk score. The model also considers the
              types of police incidents occurring nearby, and certain violent
              or drug-related categories increase the weight of the alert.
            </p>

            <h4
              style={{
                color: "#ffffff",
                marginTop: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              Suggested actionable steps
            </h4>
            <p>
              Because the model indicates near-term risk, short-term,
              targeted measures are recommended to interrupt the decline
              trajectory and stabilize properties.
            </p>
            <ul style={{ color: "#d0d0e0" }}>
              <li>
                Assign extra neighborhood patrols for code enforcement and
                sanitation on a frequent loop through the flagged area to catch
                and remediate emerging problems quickly.
              </li>
              <li>
                Deploy community outreach teams and tenant-support programs to
                reduce evictions and connect residents to services.
              </li>
              <li>
                Coordinate with police and code enforcement for joint
                operations like boarding, securement, and rapid cleanup.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Now show the image as a full-width card below (copied from 38118) */}
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
          src="/images/plots/Frayser_predictors_vs_blight.png"
          alt="Frayser Neighborhood Analysis"
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
          <h3 style={{ margin: 0, color: "#ffffff" }}>Frayser </h3>
          <p style={{ margin: 0, color: "#a0a0b2" }}>
            Multi-factor correlation analysis
          </p>
        </div>
      </div>
    </div>
  );
}

export default Zip38127;
