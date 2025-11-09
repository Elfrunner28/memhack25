function Zip38118() {
  return (
    <div style={{ lineHeight: 1.6 }}>
      {/* Top Section: Title/Description Left, Detailed Text Right (swapped) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 560px', 
        gap: '2rem', 
        marginBottom: '2rem',
        alignItems: 'start'
      }}>
        {/* Left: Title and Short Description */}
        <div>
          <h2 style={{ 
            marginTop: 0, 
            fontSize: '2rem',
            marginBottom: '1rem',
            color: '#ffffff'
          }}>
            Parkway Village & Oakville
          </h2>
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#a0a0b2',
            lineHeight: 1.7,
            marginBottom: '1.5rem'
          }}>
            A high-risk area showing strong correlations between evictions, police incidents, 
            and code enforcement violations. Our predictive model indicates significant blight 
            patterns requiring immediate attention and intervention.
          </p>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <h4 style={{ marginTop: 0, marginBottom: '0.75rem', color: '#ffffff' }}>Key Indicators</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#a0a0b2' }}>
              <li>Elevated eviction rates correlating with property neglect</li>
              <li>Increased police incidents in vacant property areas</li>
              <li>High frequency of code enforcement violations</li>
              <li>Declining property maintenance patterns</li>
            </ul>
          </div>
        </div>

        {/* Right: Larger Text Box (moved up) */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          padding: '1.25rem',
          marginTop: '0'
        }}>
          <h3 style={{ 
            marginTop: 0, 
            marginBottom: '1rem',
            fontSize: '1.25rem',
            color: '#ffffff'
          }}>
            Detailed Analysis & Recommendations
          </h3>

          <div style={{ fontSize: '0.95rem', color: '#d0d0e0', lineHeight: 1.7 }}>
            <h4 style={{ color: '#ffffff', marginTop: '0', marginBottom: '0.5rem' }}>
              Current Situation
            </h4>
            <p>
              Parkway Village and Oakville neighborhoods in ZIP 38118 demonstrate a concerning pattern 
              of interconnected blight indicators. Data analysis reveals a strong correlation between 
              rising eviction rates and subsequent property deterioration. Areas with higher eviction 
              frequencies show a 73% increase in code enforcement violations within 12 months.
            </p>

            <h4 style={{ color: '#ffffff', marginTop: '1rem', marginBottom: '0.5rem' }}>
              Predictive Insights
            </h4>
            <p>
              Our algorithm identifies properties at risk by analyzing police incident reports, 
              eviction filings, and historical code enforcement data. Properties within a 0.5-mile 
              radius of multiple eviction clusters show 2.4x higher likelihood of future violations.
            </p>

           
          </div>
        </div>
      </div>

      {/* Now show the image as a full-width card below (swapped) */}
      <div style={{
        marginTop: '1.5rem',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1rem',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)'
      }}>
        <img 
          src="/images/plots/Parkway_Village_predictors_vs_blight.png" 
          alt="Parkway Village Analysis" 
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '80vh',
            objectFit: 'contain',
            borderRadius: '12px'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
          <h3 style={{ margin: 0, color: '#ffffff' }}>Parkway Village <span style={{ marginLeft: '0.5rem', background: '#ef4444', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>High Risk</span></h3>
          <p style={{ margin: 0, color: '#a0a0b2' }}>Predictor correlation analysis</p>
        </div>
      </div>
    </div>
  );
}

export default Zip38118;