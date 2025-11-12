import csv
from collections import Counter
from pathlib import Path

# Project root and input/output paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
csv_file = PROJECT_ROOT / 'data' / 'filtered_Data' / 'data.csv'

# Store all neighborhoods
neighborhoods = []
all_data = []

# Read the CSV file
with open(csv_file, 'r', encoding='utf-8') as file:
    # Use semicolon as delimiter since that's what your CSV uses
    reader = csv.DictReader(file, delimiter=';')
    
    for row in reader:
        all_data.append(row)
        neighborhoods.append(row['neighborhood'])

# Create a set of unique neighborhoods
unique_neighborhoods = set(neighborhoods)

# Count frequency of each neighborhood
neighborhood_counts = Counter(neighborhoods)

# Display results
print("=" * 60)
print("UNIQUE NEIGHBORHOODS")
print("=" * 60)
print(f"\nTotal unique neighborhoods: {len(unique_neighborhoods)}")
print("\nAll unique neighborhoods:")
for neighborhood in sorted(unique_neighborhoods):
    print(f"  - {neighborhood}")

print("\n" + "=" * 60)
print("NEIGHBORHOOD FREQUENCY")
print("=" * 60)
for neighborhood, count in neighborhood_counts.most_common():
    print(f"{neighborhood}: {count} entries")

print("\n" + "=" * 60)
print("DATASET INFO")
print("=" * 60)
print(f"Total entries: {len(all_data)}")

# The data is now loaded and ready to work with
print("\n" + "=" * 60)
print("Ready to work with the data!")
print("=" * 60)
print("\nVariables available:")
print("  - all_data: list of all rows (dictionaries)")
print("  - neighborhoods: list of all neighborhood values")
print("  - unique_neighborhoods: set of unique neighborhoods")
print("  - neighborhood_counts: Counter object with frequencies")

# Define neighborhoods to include (in order of frequency)
neighborhoods_to_include = [
    'Parkway Village',
    'Hickory Hill',
    'Orange Mound',
    'Frayser',
    'Egypt'
]

# Define columns to keep in the new CSV
columns_to_keep = [
    'service_request_number',
    'reported_date',
    'service_request_summary',
    'category',
    'definition',
    'follow_up_date',
    'service_request_type',
    'neighborhood'
]

# Sort data by neighborhood frequency (only including specified neighborhoods)
sorted_data = []

# Add neighborhoods in the specified order
for neighborhood in neighborhoods_to_include:
    for row in all_data:
        if row['neighborhood'] == neighborhood:
            sorted_data.append(row)

# Write the new organized CSV
output_file = PROJECT_ROOT / 'data' / 'filtered_Data' / 'filtered_data.csv'

with open(output_file, 'w', encoding='utf-8', newline='') as file:
    writer = csv.DictWriter(file, fieldnames=columns_to_keep, delimiter=';', extrasaction='ignore')
    writer.writeheader()
    writer.writerows(sorted_data)

print("\n" + "=" * 60)
print("NEW CSV FILE CREATED")
print("=" * 60)
print(f"Output file: {output_file}")
print(f"Columns included: {len(columns_to_keep)}")
print(f"Total rows: {len(sorted_data)}")
print("\nFiltered neighborhoods (in order):")
for neighborhood in neighborhoods_to_include:
    count = sum(1 for row in sorted_data if row['neighborhood'] == neighborhood)
    print(f"  - {neighborhood}: {count} entries")
print("\nOrganization:")
print("  - Only the 5 specified neighborhoods included")
print("  - Neighborhoods sorted by frequency (most common first)")
print("  - Only selected columns included")