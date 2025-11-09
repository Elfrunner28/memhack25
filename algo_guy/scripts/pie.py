import matplotlib.pyplot as plt
import csv
import os
from datetime import datetime
from collections import defaultdict
import numpy as np

# Directories
police_dir = 'C:/Users/nafla/Documents/memhack25/algo_guy/data/hoods_Police'
service_requests_dir = 'C:/Users/nafla/Documents/memhack25/algo_guy/data/hoods'

# Neighborhoods
neighborhoods = ['Egypt', 'Frayser', 'Orange_Mound', 'Parkway_Village']

# Data provided for evictions only
evictions_data = {
    'Egypt': 1848,
    'Frayser': 1314,
    'Orange_Mound': 918,
    'Parkway_Village': 1899
}

# Generate months for 2022
months_2022 = []
for month in range(1, 13):
    months_2022.append(f"2022-{month:02d}")

print("=" * 80)
print("READING SERVICE REQUEST DATA BY CATEGORY (ALL YEARS)")
print("=" * 80)

# Store service request data by category across all neighborhoods
service_category_totals = defaultdict(int)

# Get all CSV files in the hoods directory
csv_files = [f for f in os.listdir(service_requests_dir) if f.endswith('.csv')]

print(f"Found {len(csv_files)} CSV files in {service_requests_dir}")

# Read ALL CSV files
for filename in csv_files:
    filepath = os.path.join(service_requests_dir, filename)
    
    print(f"Reading {filename}...")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file, delimiter=';')
            
            count = 0
            for row in reader:
                try:
                    # Count ALL records, not just 2022
                    category = row['category'].strip()
                    service_category_totals[category] += 1
                    count += 1
                except KeyError as e:
                    # Skip rows with missing category
                    continue
        
        print(f"  ✓ Loaded {count} records")
        
    except FileNotFoundError:
        print(f"  ✗ File not found: {filepath}")
    except Exception as e:
        print(f"  ✗ Error reading file: {e}")

print(f"\n✓ Found {len(service_category_totals)} service request categories")
print(f"✓ Total service requests: {sum(service_category_totals.values())}")

print("\n" + "=" * 80)
print("READING POLICE DATA BY CATEGORY (2022)")
print("=" * 80)

# Store police data by category across all neighborhoods
crime_category_totals = defaultdict(int)

# Read Police Data
for neighborhood in neighborhoods:
    filename = f"{neighborhood}.csv"
    filepath = os.path.join(police_dir, filename)
    
    print(f"Reading {neighborhood} police data...")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                offense_date = datetime.strptime(row['Offense Date'], '%Y-%m-%d %H:%M:%S%z')
                
                if datetime(2022, 1, 1) <= offense_date.replace(tzinfo=None) <= datetime(2022, 12, 31):
                    category = row['UCR Category'].strip()
                    crime_category_totals[category] += 1
        
        print(f"  ✓ Loaded")
        
    except FileNotFoundError:
        print(f"  ✗ File not found: {filepath}")

print(f"\n✓ Found {len(crime_category_totals)} crime categories")

# Create pie charts
print("\n" + "=" * 80)
print("CREATING PIE CHARTS")
print("=" * 80)

# Color schemes - vibrant and professional for dark grey background
colors_neighborhoods = ['#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181']  # Coral Red, Teal, Mint, Rose

# For police chart - vibrant modern colors
colors_crimes = [
    '#FF6B6B',  # Coral Red
    '#4ECDC4',  # Teal
    '#45B7D1',  # Sky Blue
    '#FFA07A',  # Light Salmon
    '#98D8C8',  # Mint
    '#FFD93D',  # Golden Yellow
    '#A8E6CF',  # Pastel Green
    '#FF8B94',  # Pink
    '#6BCF7F',  # Light Green
    '#FFB347',  # Pastel Orange
    '#B4A7D6',  # Lavender
    '#7FCDCD',  # Aqua
    '#FDCB6E',  # Warm Yellow
    '#6C5CE7',  # Purple
    '#74B9FF'   # Light Blue
]

# 1. Code Enforcement (Service Requests) by Category Pie Chart
print("Creating Service Requests by Category pie chart...")

# Group into three categories: Weeds, Inspection-Junky Yards, Other
grouped_categories = {
    'Weeds': 0,
    'Inspection-Junky Yard': 0,
    'Other': 0
}

for category, count in service_category_totals.items():
    if 'Weed' in category or 'weed' in category.lower():
        grouped_categories['Weeds'] += count
    elif 'Junky' in category or 'junky' in category.lower():
        grouped_categories['Inspection-Junky Yard'] += count
    else:
        grouped_categories['Other'] += count

# Prepare data for pie chart
sr_categories = list(grouped_categories.keys())
sr_values = list(grouped_categories.values())
sr_total = sum(sr_values)

# Use just 3 colors from our palette
colors_service = [colors_crimes[0], colors_crimes[1], colors_crimes[2]]

fig, ax = plt.subplots(figsize=(10, 8))
fig.patch.set_facecolor('#2d2d2d')  # Grey background
ax.set_facecolor('#2d2d2d')

wedges, texts, autotexts = ax.pie(sr_values, labels=sr_categories, autopct='%1.1f%%',
                                    startangle=90, colors=colors_service,
                                    textprops={'fontsize': 11, 'weight': 'bold', 'color': 'white'})

ax.set_title('Service Requests by Category\nTotal: ' + str(sr_total),
             fontsize=14, fontweight='bold', pad=20, color='white')

# Make percentage text larger and white
for autotext in autotexts:
    autotext.set_color('white')
    autotext.set_fontsize(10)
    autotext.set_weight('bold')

plt.tight_layout()
plt.savefig('service_requests_by_category_pie_chart.png', dpi=300, bbox_inches='tight')
print("  ✓ Saved: service_requests_by_category_pie_chart.png")
plt.close()

# 2. Evictions Pie Chart
print("Creating Evictions pie chart...")
fig, ax = plt.subplots(figsize=(10, 8))
fig.patch.set_facecolor('#2d2d2d')  # Grey background
ax.set_facecolor('#2d2d2d')

neighborhoods_display = [n.replace('_', ' ') for n in neighborhoods]
ev_values = [evictions_data[n] for n in neighborhoods]
ev_total = sum(ev_values)
ev_percentages = [(v/ev_total)*100 for v in ev_values]

wedges, texts, autotexts = ax.pie(ev_values, labels=neighborhoods_display, autopct='%1.1f%%',
                                    startangle=90, colors=colors_neighborhoods,
                                    textprops={'fontsize': 11, 'weight': 'bold', 'color': 'white'})

ax.set_title('Eviction Filings by Neighborhood (2022)\nTotal: ' + str(ev_total),
             fontsize=14, fontweight='bold', pad=20, color='white')

# Make percentage text larger and white
for autotext in autotexts:
    autotext.set_color('white')
    autotext.set_fontsize(12)
    autotext.set_weight('bold')

plt.tight_layout()
plt.savefig('evictions_pie_chart.png', dpi=300, bbox_inches='tight')
print("  ✓ Saved: evictions_pie_chart.png")
plt.close()

# 3. Police Crime Categories Pie Chart
print("Creating Police Crime Categories pie chart...")

# Sort by frequency
crime_sorted = sorted(crime_category_totals.items(), key=lambda x: x[1], reverse=True)

# Show top 10 categories individually, group rest as "Other"
top_n = 10
if len(crime_sorted) > top_n:
    top_categories = crime_sorted[:top_n]
    other_total = sum([count for _, count in crime_sorted[top_n:]])
    
    categories = [cat for cat, _ in top_categories] + ['Other']
    values = [count for _, count in top_categories] + [other_total]
else:
    categories = [cat for cat, _ in crime_sorted]
    values = [count for _, count in crime_sorted]

total_crimes = sum(values)

fig, ax = plt.subplots(figsize=(12, 10))
fig.patch.set_facecolor('#2d2d2d')  # Grey background
ax.set_facecolor('#2d2d2d')

# Ensure we have enough colors (cycle if needed)
colors_to_use = colors_crimes * (len(values) // len(colors_crimes) + 1)
colors_to_use = colors_to_use[:len(values)]

wedges, texts, autotexts = ax.pie(values, labels=categories, autopct='%1.1f%%',
                                    startangle=90, colors=colors_to_use,
                                    textprops={'fontsize': 9, 'weight': 'bold', 'color': 'white'})

ax.set_title('Police Incidents by Crime Category (2022)\nTotal Incidents: ' + str(total_crimes),
             fontsize=14, fontweight='bold', pad=20, color='white')

# Make percentage text more visible
for autotext in autotexts:
    autotext.set_color('white')
    autotext.set_fontsize(10)
    autotext.set_weight('bold')

plt.tight_layout()
plt.savefig('police_crime_categories_pie_chart.png', dpi=300, bbox_inches='tight')
print("  ✓ Saved: police_crime_categories_pie_chart.png")
plt.close()

# Print statistics
print("\n" + "=" * 80)
print("STATISTICS SUMMARY")
print("=" * 80)

print("\nSERVICE REQUESTS BY CATEGORY:")
print(f"{'Category':<30} {'Count':<10} {'Percentage'}")
print("-" * 60)
for category in sr_categories:
    count = grouped_categories[category]
    percentage = (count/sr_total)*100
    print(f"{category:<30} {count:<10} {percentage:.1f}%")
print(f"{'TOTAL':<30} {sr_total}")

print("\nEVICTIONS:")
print(f"{'Neighborhood':<20} {'Count':<10} {'Percentage'}")
print("-" * 50)
for i, neighborhood in enumerate(neighborhoods):
    name_display = neighborhood.replace('_', ' ')
    print(f"{name_display:<20} {ev_values[i]:<10} {ev_percentages[i]:.1f}%")
print(f"{'TOTAL':<20} {ev_total}")

print("\nPOLICE CRIME CATEGORIES (Top 15):")
print(f"{'Category':<35} {'Count':<10} {'Percentage'}")
print("-" * 65)
for category, count in crime_sorted[:15]:
    percentage = (count/total_crimes)*100
    print(f"{category:<35} {count:<10} {percentage:.1f}%")
if len(crime_sorted) > 15:
    other_count = sum([count for _, count in crime_sorted[15:]])
    other_pct = (other_count/total_crimes)*100
    print(f"{'Other Categories':<35} {other_count:<10} {other_pct:.1f}%")
print(f"{'TOTAL':<35} {total_crimes}")

print("\n✓ All pie charts created successfully!")
print("\nFiles saved:")
print("  - service_requests_by_category_pie_chart.png")
print("  - evictions_pie_chart.png")
print("  - police_crime_categories_pie_chart.png")