import csv
from collections import Counter
from pathlib import Path

# Project root and input file
PROJECT_ROOT = Path(__file__).resolve().parent.parent
input_file = PROJECT_ROOT / 'data' / 'filtered_Data' / 'filtered_evictions.csv'

# Mapping of zip codes to neighborhoods
zip_to_neighborhood = {
    '38128': 'Egypt',
    '38127': 'Frayser',
    '38118': 'Parkway_Village',
    '38114': 'Orange_Mound'
}

# Columns in the CSV
columns = [
    'Filing Date',
    'Latitude',
    'Longitude',
    'Zip Code 2022',
    'Was Defendant Evicted',
    'Total Evictions'
]

# Storage for each neighborhood
neighborhood_data = {
    'Frayser': [],
    'Parkway_Village': [],
    'Orange_Mound': [],
    'Egypt': []
}

print("=" * 80)
print("READING EVICTION DATA")
print("=" * 80)

# Read the input CSV
try:
    with open(input_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file, delimiter=';')
        
        total_rows = 0
        matched_rows = 0
        
        for row in reader:
            total_rows += 1
            zip_code = row['Zip Code 2022']
            
            # Check if zip code matches our target zip codes
            if zip_code in zip_to_neighborhood:
                neighborhood = zip_to_neighborhood[zip_code]
                neighborhood_data[neighborhood].append(row)
                matched_rows += 1
        
        print(f"✓ Read {total_rows} total rows")
        print(f"✓ Matched {matched_rows} rows to target zip codes")
        
except FileNotFoundError:
    print(f"✗ Error: File '{input_file}' not found")
    exit(1)

# Display breakdown by neighborhood
print("\n" + "=" * 80)
print("NEIGHBORHOOD BREAKDOWN")
print("=" * 80)

for neighborhood, data in neighborhood_data.items():
    if len(data) > 0:
        print(f"\n{neighborhood}:")
        print(f"  Total cases: {len(data)}")
        
        # Count evictions
        evicted = sum(1 for row in data if row['Was Defendant Evicted'].lower() == 'yes')
        print(f"  Evicted: {evicted}")
        print(f"  Not evicted: {len(data) - evicted}")
        
        # Get zip codes for this neighborhood
        zips = set(row['Zip Code 2022'] for row in data)
        print(f"  Zip codes: {', '.join(sorted(zips))}")

# Create CSV files for each neighborhood
print("\n" + "=" * 80)
print("CREATING NEIGHBORHOOD CSV FILES")
print("=" * 80)

files_created = []

for neighborhood, data in neighborhood_data.items():
    if len(data) > 0:  # Only create file if there's data
        filename = f"{neighborhood}.csv"
        
        with open(filename, 'w', encoding='utf-8', newline='') as file:
            writer = csv.DictWriter(file, fieldnames=columns, delimiter=';')
            writer.writeheader()
            writer.writerows(data)
        
        files_created.append(filename)
        print(f"✓ Created: {filename} ({len(data)} rows)")
    else:
        print(f"⚠ Skipped: {neighborhood}.csv (no data)")

print("\n" + "=" * 80)
print("SUMMARY")
print("=" * 80)
print(f"\nFiles created: {len(files_created)}")
for filename in files_created:
    print(f"  - {filename}")

print("\n" + "=" * 80)
print("ZIP CODE MAPPING USED")
print("=" * 80)
print("38128 → Egypt")
print("38127 → Frayser")
print("38118 → Parkway Village")
print("38114 → Orange Mound")