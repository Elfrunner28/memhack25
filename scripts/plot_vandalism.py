import matplotlib.pyplot as plt
import csv
import os
from datetime import datetime
from collections import defaultdict
from pathlib import Path

# Project root and police data directory
PROJECT_ROOT = Path(__file__).resolve().parent.parent
police_dir = PROJECT_ROOT / 'data' / 'neighborhoods_Police'

# Neighborhoods
neighborhoods = ['Egypt', 'Frayser', 'Parkway_Village', 'Orange_Mound']

# Target category
target_category = 'DEST/DAM/VAND OF PROPERTY'

# Generate all months from Jan 2021 to Dec 2022
all_months = []
current_date = datetime(2021, 1, 1)
end_date = datetime(2022, 12, 31)

while current_date <= end_date:
    all_months.append(current_date.strftime('%Y-%m'))
    # Move to next month
    if current_date.month == 12:
        current_date = datetime(current_date.year + 1, 1, 1)
    else:
        current_date = datetime(current_date.year, current_date.month + 1, 1)

print("=" * 80)
print(f"READING POLICE DATA - {target_category}")
print("=" * 80)

# Store vandalism data by neighborhood and month
vandalism_data = {neighborhood: defaultdict(int) for neighborhood in neighborhoods}

for neighborhood in neighborhoods:
    filename = f"{neighborhood}.csv"
    filepath = police_dir / filename
    
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            count = 0
            for row in reader:
                # Check if this is a vandalism incident
                if row['UCR Category'].strip() == target_category:
                    # Parse offense date (format: 2021-02-19 02:00:00+00:00)
                    offense_date = datetime.strptime(row['Offense Date'], '%Y-%m-%d %H:%M:%S%z')
                    
                    # Only include data from Jan 2021 to Dec 2022
                    if datetime(2021, 1, 1) <= offense_date.replace(tzinfo=None) <= datetime(2022, 12, 31):
                        year_month = offense_date.strftime('%Y-%m')
                        vandalism_data[neighborhood][year_month] += 1
                        count += 1
            
            print(f"✓ {neighborhood}: {count} vandalism incidents (Jan 2021 - Dec 2022)")
    
    except FileNotFoundError:
        print(f"✗ File not found: {filepath}")

print("\n" + "=" * 80)
print("CREATING PLOT")
print("=" * 80)

# Colors for each neighborhood
colors = {
    'Egypt': '#1f77b4',
    'Frayser': '#ff7f0e',
    'Parkway_Village': '#2ca02c',
    'Orange_Mound': '#d62728'
}

# Create the plot
plt.figure(figsize=(16, 8))

for neighborhood in neighborhoods:
    counts = [vandalism_data[neighborhood].get(month, 0) for month in all_months]
    plt.plot(range(len(all_months)), counts, marker='o', linewidth=2, markersize=6,
             label=neighborhood.replace('_', ' '), color=colors[neighborhood], alpha=0.8)

# Format x-axis labels to show every 3 months
tick_positions = range(0, len(all_months), 3)
tick_labels = [all_months[i] for i in tick_positions]

plt.xlabel('Month', fontsize=12, fontweight='bold')
plt.ylabel('Number of Incidents', fontsize=12, fontweight='bold')
plt.title('Destruction/Damage/Vandalism of Property by Month (Jan 2021 - Dec 2022)\nMemphis Neighborhoods',
          fontsize=14, fontweight='bold')
plt.legend(loc='best', fontsize=10)
plt.grid(True, alpha=0.3)
plt.xticks(tick_positions, tick_labels, rotation=45, ha='right')
plt.tight_layout()

# Save the plot
output_file = 'vandalism_by_month_2021_2022.png'
plt.savefig(output_file, dpi=300, bbox_inches='tight')
print(f"✓ Plot saved as: {output_file}")

# Show the plot
plt.show()

print("\n" + "=" * 80)
print("SUMMARY STATISTICS (JAN 2021 - DEC 2022)")
print("=" * 80)

print(f"\n{target_category}:")
for neighborhood in neighborhoods:
    total = sum(vandalism_data[neighborhood].values())
    if total > 0:
        avg = total / 24
        # Find peak month
        if vandalism_data[neighborhood]:
            peak_month = max(vandalism_data[neighborhood], key=vandalism_data[neighborhood].get)
            peak_count = vandalism_data[neighborhood][peak_month]
            print(f"  {neighborhood.replace('_', ' ')}: {total} total (avg {avg:.1f}/month, peak: {peak_month} with {peak_count})")
    else:
        print(f"  {neighborhood.replace('_', ' ')}: 0 incidents")

print("\n✓ Plot created successfully!")