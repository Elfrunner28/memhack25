import matplotlib.pyplot as plt
import csv
from collections import defaultdict, Counter
from pathlib import Path

# Project root and filtered data file
PROJECT_ROOT = Path(__file__).resolve().parent.parent
csv_file = PROJECT_ROOT / 'data' / 'filtered_Data' / 'filtered_data.csv'

# Store all neighborhoods
neighborhoods = []
all_data = []

with open(csv_file, 'r', encoding='utf-8') as file:
    # Use semicolon as delimiter since that's what your CSV uses
    reader = csv.DictReader(file, delimiter=';')
    
    for row in reader:
        all_data.append(row)
        neighborhoods.append(row['neighborhood'])

# Create data structure for each neighborhood
neighborhood_data = defaultdict(lambda: {
    'total_incidents': 0,
    'incidents': [],
    'categories': Counter(),
    'service_types': Counter(),
    'definitions': Counter()
})

# Populate the data structure
for row in all_data:
    neighborhood = row['neighborhood']
    
    # Increment total incidents
    neighborhood_data[neighborhood]['total_incidents'] += 1
    
    # Add the full incident record
    neighborhood_data[neighborhood]['incidents'].append({
        'service_request_number': row['service_request_number'],
        'reported_date': row['reported_date'],
        'service_request_summary': row['service_request_summary'],
        'category': row['category'],
        'definition': row['definition'],
        'follow_up_date': row['follow_up_date'],
        'service_request_type': row['service_request_type']
    })
    
    # Count categories, service types, and definitions
    neighborhood_data[neighborhood]['categories'][row['category']] += 1
    neighborhood_data[neighborhood]['service_types'][row['service_request_type']] += 1
    neighborhood_data[neighborhood]['definitions'][row['definition']] += 1

# Display summary for each neighborhood
print("=" * 80)
print("NEIGHBORHOOD DATA SUMMARY")
print("=" * 80)

for neighborhood in ['Parkway Village', 'Hickory Hill', 'Orange Mound', 'Frayser', 'Egypt']:
    if neighborhood in neighborhood_data:
        data = neighborhood_data[neighborhood]
        print(f"\n{neighborhood.upper()}")
        print("-" * 80)
        print(f"Total Incidents: {data['total_incidents']}")
        
        print(f"\nTop 5 Categories:")
        for category, count in data['categories'].most_common(5):
            print(f"  - {category}: {count}")
        
        print(f"\nTop 5 Service Types:")
        for service_type, count in data['service_types'].most_common(5):
            print(f"  - {service_type}: {count}")
        
        print(f"\nTop 5 Definitions:")
        for definition, count in data['definitions'].most_common(5):
            print(f"  - {definition}: {count}")

print("\n" + "=" * 80)
print("DATA STRUCTURE AVAILABLE")
print("=" * 80)
print("\nAccess data using: neighborhood_data['Neighborhood Name']")
print("\nEach neighborhood has:")
print("  - total_incidents: int")
print("  - incidents: list of dicts (all incident records)")
print("  - categories: Counter object")
print("  - service_types: Counter object")
print("  - definitions: Counter object")
print("\nExample usage:")
print("  neighborhood_data['Parkway Village']['total_incidents']")
print("  neighborhood_data['Hickory Hill']['categories'].most_common(3)")
print("  neighborhood_data['Orange Mound']['incidents'][0]")