import csv
from pathlib import Path

# Project root and input/output file names
PROJECT_ROOT = Path(__file__).resolve().parent.parent
input_file = PROJECT_ROOT / 'data' / 'filtered_Data' / 'eviction-court-cases-shelby-county.csv'
output_file = PROJECT_ROOT / 'data' / 'filtered_Data' / 'filtered_evictions.csv'

# Columns to keep
columns_to_keep = [
    'Filing Date',
    'Latitude',
    'Longitude',
    'Zip Code 2022',
    'Was Defendant Evicted',
    'Total Evictions'
]

# Read the input CSV and filter columns
all_data = []

print("=" * 80)
print("READING EVICTION DATA")
print("=" * 80)

try:
    with open(input_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file, delimiter=';')
        
        # Check if all required columns exist
        missing_cols = [col for col in columns_to_keep if col not in reader.fieldnames]
        if missing_cols:
            print(f"Warning: Missing columns: {missing_cols}")
        
        for row in reader:
            # Extract only the columns we want
            filtered_row = {col: row.get(col, '') for col in columns_to_keep}
            all_data.append(filtered_row)
    
    print(f"✓ Successfully read {len(all_data)} rows")
    
except FileNotFoundError:
    print(f"✗ Error: File '{input_file}' not found")
    exit(1)

# Write filtered data to new CSV
print("\n" + "=" * 80)
print("CREATING FILTERED CSV")
print("=" * 80)

with open(output_file, 'w', encoding='utf-8', newline='') as file:
    writer = csv.DictWriter(file, fieldnames=columns_to_keep, delimiter=';')
    writer.writeheader()
    writer.writerows(all_data)

print(f"✓ Filtered CSV created: {output_file}")
print(f"  Total rows: {len(all_data)}")
print(f"  Columns included: {len(columns_to_keep)}")

# Display summary statistics
print("\n" + "=" * 80)
print("SUMMARY STATISTICS")
print("=" * 80)

# Count evictions
evicted_count = sum(1 for row in all_data if row['Was Defendant Evicted'].lower() in ['yes', 'true', '1'])
not_evicted_count = sum(1 for row in all_data if row['Was Defendant Evicted'].lower() in ['no', 'false', '0'])

print(f"\nEviction Status:")
print(f"  Evicted: {evicted_count}")
print(f"  Not Evicted: {not_evicted_count}")
print(f"  Unknown/Other: {len(all_data) - evicted_count - not_evicted_count}")

# Count by zip code
zip_codes = {}
for row in all_data:
    zip_code = row['Zip Code 2022']
    if zip_code:
        zip_codes[zip_code] = zip_codes.get(zip_code, 0) + 1

print(f"\nTop 5 Zip Codes by Case Count:")
sorted_zips = sorted(zip_codes.items(), key=lambda x: x[1], reverse=True)
for zip_code, count in sorted_zips[:5]:
    print(f"  {zip_code}: {count} cases")

# Total evictions statistics
total_evictions_list = []
for row in all_data:
    try:
        if row['Total Evictions']:
            total_evictions_list.append(int(row['Total Evictions']))
    except ValueError:
        pass

if total_evictions_list:
    print(f"\nTotal Evictions Statistics:")
    print(f"  Average: {sum(total_evictions_list) / len(total_evictions_list):.2f}")
    print(f"  Maximum: {max(total_evictions_list)}")
    print(f"  Minimum: {min(total_evictions_list)}")

print("\n" + "=" * 80)
print("FILTERING COMPLETE")
print("=" * 80)
print(f"\nFiltered data saved to: {output_file}")