import csv
import os
from datetime import datetime
from pathlib import Path

# Project root and input directory (project-relative)
PROJECT_ROOT = Path(__file__).resolve().parent.parent
input_dir = PROJECT_ROOT / 'data' / 'neighborhoods_Evictions'

# Neighborhood files
neighborhoods = ['Egypt', 'Frayser', 'Parkway_Village', 'Orange_Mound']

# Columns in the CSV
columns = [
    'Filing Date',
    'Latitude',
    'Longitude',
    'Zip Code 2022',
    'Was Defendant Evicted',
    'Total Evictions'
]

# Create directory if it doesn't exist
if not input_dir.exists():
    input_dir.mkdir(parents=True, exist_ok=True)
    print(f"✓ Created directory: {input_dir}")

print("=" * 80)
print("READING AND ORGANIZING EVICTION DATA CHRONOLOGICALLY")
print("=" * 80)

# Process each neighborhood file
for neighborhood in neighborhoods:
    filename = f"{neighborhood}.csv"
    filepath = input_dir / filename
    
    # Read the data
    data = []
    
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file, delimiter=';')
            
            for row in reader:
                data.append(row)
        
        print(f"\n✓ Read {neighborhood}.csv: {len(data)} rows")
        
        # Sort chronologically by Filing Date
        data_sorted = sorted(data, key=lambda x: datetime.strptime(x['Filing Date'], '%Y-%m-%d'))
        
        # Overwrite the file with sorted data
        with open(filepath, 'w', encoding='utf-8', newline='') as file:
            writer = csv.DictWriter(file, fieldnames=columns, delimiter=';')
            writer.writeheader()
            writer.writerows(data_sorted)
        
        print(f"✓ Sorted and saved {neighborhood}.csv")
        
        if len(data_sorted) > 0:
            first_date = data_sorted[0]['Filing Date']
            last_date = data_sorted[-1]['Filing Date']
            print(f"  Date Range: {first_date} to {last_date}")
            
            # Count evictions
            evicted_count = sum(1 for row in data_sorted if row['Was Defendant Evicted'] == 'Yes')
            print(f"  Evicted: {evicted_count} / {len(data_sorted)}")
            
            # Show first and last case
            print(f"  First case: {data_sorted[0]['Filing Date']} - Evicted: {data_sorted[0]['Was Defendant Evicted']}")
            print(f"  Last case: {data_sorted[-1]['Filing Date']} - Evicted: {data_sorted[-1]['Was Defendant Evicted']}")
        
    except FileNotFoundError:
        print(f"✗ File not found: {filepath}")
    except Exception as e:
        print(f"✗ Error processing {neighborhood}: {str(e)}")

print("\n" + "=" * 80)
print("CHRONOLOGICAL ORGANIZATION COMPLETE")
print("=" * 80)
print(f"\nAll files in '{input_dir}/' are now sorted by Filing Date (oldest to newest)")