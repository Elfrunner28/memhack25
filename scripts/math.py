import numpy as np
from pathlib import Path

print("=" * 80)
print("CORRELATION ANALYSIS USING NUMPY ARRAYS (2022)")
print("=" * 80)

# Project root and arrays (saved in scripts/)
PROJECT_ROOT = Path(__file__).resolve().parent.parent
evictions_array = np.load(str(PROJECT_ROOT / 'scripts' / 'evictions_2022_array.npy'))
police_array = np.load(str(PROJECT_ROOT / 'scripts' / 'police_2022_array.npy'))
service_requests_array = np.load(str(PROJECT_ROOT / 'scripts' / 'service_requests_2022_array.npy'))

# Neighborhoods in alphabetical order (matching the array rows)
neighborhoods = ['Egypt', 'Frayser', 'Orange Mound', 'Parkway Village']

print("\nLoaded arrays:")
print(f"  Evictions:        {evictions_array.shape}")
print(f"  Police:           {police_array.shape}")
print(f"  Service Requests: {service_requests_array.shape}")

# Calculate correlation coefficients for each neighborhood
print("\n" + "=" * 80)
print("CORRELATION COEFFICIENTS BY NEIGHBORHOOD (2022)")
print("=" * 80)

for i, neighborhood in enumerate(neighborhoods):
    print(f"\n{neighborhood}:")
    print("-" * 80)
    
    # Get the row for this neighborhood (12 months of data)
    evictions = evictions_array[i, :]
    police = police_array[i, :]
    blight = service_requests_array[i, :]
    
    # Calculate correlations
    corr_police_blight = np.corrcoef(police, blight)[0, 1]
    corr_evictions_blight = np.corrcoef(evictions, blight)[0, 1]
    corr_police_evictions = np.corrcoef(police, evictions)[0, 1]
    
    print(f"  Police vs Blight:          {corr_police_blight:.4f}")
    print(f"  Evictions vs Blight:       {corr_evictions_blight:.4f}")
    print(f"  Police vs Evictions:       {corr_police_evictions:.4f}")
    
    # Show monthly counts
    print(f"\n  Monthly Data (Jan-Dec 2022):")
    print(f"    Police:           {police.tolist()}")
    print(f"    Evictions:        {evictions.tolist()}")
    print(f"    Service Requests: {blight.tolist()}")

# Summary table
print("\n" + "=" * 80)
print("CORRELATION SUMMARY TABLE")
print("=" * 80)
print(f"{'Neighborhood':<20} {'Police vs Blight':<20} {'Evictions vs Blight':<20}")
print("-" * 80)

for i, neighborhood in enumerate(neighborhoods):
    evictions = evictions_array[i, :]
    police = police_array[i, :]
    blight = service_requests_array[i, :]
    
    corr_police_blight = np.corrcoef(police, blight)[0, 1]
    corr_evictions_blight = np.corrcoef(evictions, blight)[0, 1]
    
    print(f"{neighborhood:<20} {corr_police_blight:<20.4f} {corr_evictions_blight:<20.4f}")

print("\n" + "=" * 80)
print("INTERPRETATION GUIDE")
print("=" * 80)
print("Correlation coefficient ranges from -1 to 1:")
print("  1.0    = Perfect positive correlation")
print("  0.7+   = Strong positive correlation")
print("  0.3-0.7 = Moderate positive correlation")
print("  0.0    = No correlation")
print("  Negative = Inverse relationship")