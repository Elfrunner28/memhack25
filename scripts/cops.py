import csv
import os
from collections import Counter
from pathlib import Path

# Project root and paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
input_file = PROJECT_ROOT / 'data' / 'filtered_Data' / 'policeReports.csv'

# Output directory (per-neighborhood police CSVs)
output_dir = PROJECT_ROOT / 'data' / 'neighborhoods_Police'

# Create output directory if it doesn't exist
if not output_dir.exists():
    output_dir.mkdir(parents=True, exist_ok=True)
    print(f"✓ Created directory: {output_dir}")

# Mapping of zip codes to neighborhoods
zip_to_neighborhood = {
    '38128': 'Egypt',
    '38127': 'Frayser',
    '38118': 'Parkway_Village',
    '38114': 'Orange_Mound'
}

# Columns in the CSV
columns = [
    'Offense Date',
    'UCR Description',
    'UCR Category',
    'Zip Code'
]

# Storage for each neighborhood
neighborhood_data = {
    'Egypt': [],
    'Frayser': [],
    'Parkway_Village': [],
    'Orange_Mound': []
}

print("=" * 80)
print("READING POLICE CRIME DATA")
print("=" * 80)

# Read the input CSV
try:
    with open(input_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        total_rows = 0
        matched_rows = 0
        
        for row in reader:
            total_rows += 1
            zip_code = row['Zip Code'].strip()
            
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
        print(f"  Total crimes: {len(data)}")
        
        # Count by crime category
        categories = Counter(row['UCR Category'] for row in data)
        print(f"  Top 3 Crime Categories:")
        for category, count in categories.most_common(3):
            print(f"    - {category}: {count}")
        
        # Get zip codes for this neighborhood
        zips = set(row['Zip Code'] for row in data)
        print(f"  Zip codes: {', '.join(sorted(zips))}")

# Create CSV files for each neighborhood in hoods_Police directory
print("\n" + "=" * 80)
print("CREATING NEIGHBORHOOD CSV FILES")
print("=" * 80)

files_created = []

for neighborhood, data in neighborhood_data.items():
    if len(data) > 0:  # Only create file if there's data
        filename = f"{neighborhood}.csv"
        filepath = output_dir / filename

        with open(filepath, 'w', encoding='utf-8', newline='') as file:
            writer = csv.DictWriter(file, fieldnames=columns)
            writer.writeheader()
            writer.writerows(data)

        files_created.append(filename)
        print(f"✓ Created: {output_dir}/{filename} ({len(data)} rows)")
    else:
        print(f"⚠ Skipped: {neighborhood}.csv (no data)")

print("\n" + "=" * 80)
print("SUMMARY")
print("=" * 80)
print(f"\nFiles created in '{output_dir}' directory: {len(files_created)}")
for filename in files_created:
    print(f"  - {filename}")

print("\n" + "=" * 80)
print("ZIP CODE MAPPING USED")
print("=" * 80)
print("38128 → Egypt")
print("38127 → Frayser")
print("38118 → Parkway Village")
print("38114 → Orange Mound")

print("\nAll files saved to: " + output_dir + "/")