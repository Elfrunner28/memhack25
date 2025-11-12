import matplotlib.pyplot as plt
import csv
from datetime import datetime
from collections import Counter
from pathlib import Path

# Project root and input/output paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
csv_file = PROJECT_ROOT / 'data' / 'filtered_Data' / 'filtered_data.csv'
output_dir = PROJECT_ROOT / 'data' / 'neighborhoods'
output_dir.mkdir(parents=True, exist_ok=True)

# Store all neighborhoods
neighborhoods = []
all_data = []

with open(csv_file, 'r', encoding='utf-8') as file:
    # Use semicolon as delimiter since that's what your CSV uses
    reader = csv.DictReader(file, delimiter=';')
    
    for row in reader:
        all_data.append(row)
        neighborhoods.append(row['neighborhood'])

# Create separate database for each neighborhood
parkway_village_db = []
hickory_hill_db = []
orange_mound_db = []
frayser_db = []
egypt_db = []

# Separate data by neighborhood
for row in all_data:
    neighborhood = row['neighborhood']
    
    if neighborhood == 'Parkway Village':
        parkway_village_db.append(row)
    elif neighborhood == 'Hickory Hill':
        hickory_hill_db.append(row)
    elif neighborhood == 'Orange Mound':
        orange_mound_db.append(row)
    elif neighborhood == 'Frayser':
        frayser_db.append(row)
    elif neighborhood == 'Egypt':
        egypt_db.append(row)

# Function to sort chronologically by reported_date
def sort_chronologically(db):
    return sorted(db, key=lambda x: datetime.strptime(x['reported_date'], '%Y-%m-%d'))

# Sort each database chronologically
parkway_village_db = sort_chronologically(parkway_village_db)
hickory_hill_db = sort_chronologically(hickory_hill_db)
orange_mound_db = sort_chronologically(orange_mound_db)
frayser_db = sort_chronologically(frayser_db)
egypt_db = sort_chronologically(egypt_db)

# Define the column headers
columns = [
    'service_request_number',
    'reported_date',
    'service_request_summary',
    'category',
    'definition',
    'follow_up_date',
    'service_request_type',
    'neighborhood'
]

# Dictionary mapping neighborhood names to their databases
databases = {
    'Parkway Village': parkway_village_db,
    'Hickory Hill': hickory_hill_db,
    'Orange Mound': orange_mound_db,
    'Frayser': frayser_db,
    'Egypt': egypt_db
}

# Create a CSV file for each neighborhood
print("=" * 80)
print("CREATING NEIGHBORHOOD CSV FILES")
print("=" * 80)

for neighborhood, db in databases.items():
    # Create filename from neighborhood name
    filename = neighborhood.replace(' ', '_') + '.csv'
    
    # Write the CSV file
    outpath = output_dir / filename
    with open(outpath, 'w', encoding='utf-8', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=columns, delimiter=';')
        writer.writeheader()
        writer.writerows(db)
    
    print(f"\n✓ Created: {outpath}")
    print(f"  Total Incidents: {len(db)}")
    
    if len(db) > 0:
        # Get date range
        first_date = db[0]['reported_date']
        last_date = db[-1]['reported_date']
        print(f"  Date Range: {first_date} to {last_date}")
        
        # Count categories
        categories = Counter(row['category'] for row in db)
        print(f"  Top Category: {categories.most_common(1)[0][0]} ({categories.most_common(1)[0][1]} incidents)")

print("\n" + "=" * 80)
print("FILES CREATED SUCCESSFULLY")
print("=" * 80)
print("\nCreated files:")
print("  - Parkway_Village.csv")
print("  - Hickory_Hill.csv")
print("  - Orange_Mound.csv")
print("  - Frayser.csv")
print("  - Egypt.csv")
print("\nAll files are chronologically sorted and use semicolon delimiters.")