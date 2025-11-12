import matplotlib.pyplot as plt
import csv
import os
from datetime import datetime
from collections import defaultdict
import numpy as np
from pathlib import Path

# Project root and data directories
PROJECT_ROOT = Path(__file__).resolve().parent.parent
evictions_dir = PROJECT_ROOT / 'data' / 'neighborhoods_Evictions'
police_dir = PROJECT_ROOT / 'data' / 'neighborhoods_Police'

# Neighborhoods
neighborhoods = ['Egypt', 'Frayser', 'Parkway_Village', 'Orange_Mound']

# Generate all months from Jan 2022 to Dec 2022
all_months = []
current_date = datetime(2022, 1, 1)
end_date = datetime(2022, 12, 31)

while current_date <= end_date:
    all_months.append(current_date.strftime('%Y-%m'))
    # Move to next month
    if current_date.month == 12:
        current_date = datetime(current_date.year + 1, 1, 1)
    else:
        current_date = datetime(current_date.year, current_date.month + 1, 1)

print("=" * 80)
print("READING EVICTION DATA")
print("=" * 80)

# Store eviction data by neighborhood and month
evictions_data = {neighborhood: defaultdict(int) for neighborhood in neighborhoods}

for neighborhood in neighborhoods:
    filename = f"{neighborhood}.csv"
    filepath = evictions_dir / filename
    
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file, delimiter=';')
            
            count = 0
            for row in reader:
                # Parse filing date
                filing_date = datetime.strptime(row['Filing Date'], '%Y-%m-%d')
                
                # Only include data from 2022
                if datetime(2022, 1, 1) <= filing_date <= datetime(2022, 12, 31):
                    year_month = filing_date.strftime('%Y-%m')
                    evictions_data[neighborhood][year_month] += 1
                    count += 1
            
            print(f"✓ {neighborhood}: {count} evictions (2022)")
    
    except FileNotFoundError:
        print(f"✗ File not found: {filepath}")

print("\n" + "=" * 80)
print("READING POLICE DATA")
print("=" * 80)

# Store police data by neighborhood and month
police_data = {neighborhood: defaultdict(int) for neighborhood in neighborhoods}

for neighborhood in neighborhoods:
    filename = f"{neighborhood}.csv"
    filepath = police_dir / filename
    
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            count = 0
            for row in reader:
                # Parse offense date (format: 2021-02-19 02:00:00+00:00)
                offense_date = datetime.strptime(row['Offense Date'], '%Y-%m-%d %H:%M:%S%z')
                
                # Only include data from 2022
                if datetime(2022, 1, 1) <= offense_date.replace(tzinfo=None) <= datetime(2022, 12, 31):
                    year_month = offense_date.strftime('%Y-%m')
                    police_data[neighborhood][year_month] += 1
                    count += 1
            
            print(f"✓ {neighborhood}: {count} incidents (2022)")
    
    except FileNotFoundError:
        print(f"✗ File not found: {filepath}")

print("\n" + "=" * 80)
print("CREATING PLOTS")
print("=" * 80)

# Colors for each neighborhood
colors = {
    'Parkway_Village': '#1f77b4',
    'Orange_Mound': '#ff7f0e',
    'Frayser': '#2ca02c',
    'Egypt': '#d62728'
}

# Plot 1: Evictions
fig1, ax1 = plt.subplots(figsize=(16, 8))

for neighborhood in neighborhoods:
    counts = [evictions_data[neighborhood].get(month, 0) for month in all_months]
    ax1.plot(range(len(all_months)), counts, marker='o', linewidth=2, markersize=6,
             label=neighborhood.replace('_', ' '), color=colors[neighborhood], alpha=0.8)

# Format x-axis labels to show every month
tick_positions = range(0, len(all_months), 1)
tick_labels = [all_months[i] for i in tick_positions]

ax1.set_xlabel('Month', fontsize=12, fontweight='bold')
ax1.set_ylabel('Number of Evictions', fontsize=12, fontweight='bold')
ax1.set_title('Eviction Filings by Month (2022) - Memphis Neighborhoods',
              fontsize=14, fontweight='bold')
ax1.legend(loc='best', fontsize=10)
ax1.grid(True, alpha=0.3)
ax1.set_xticks(tick_positions)
ax1.set_xticklabels(tick_labels, rotation=45, ha='right')
plt.tight_layout()

# Save evictions plot
evictions_output = 'evictions_by_month_2022.png'
plt.savefig(evictions_output, dpi=300, bbox_inches='tight')
print(f"✓ Evictions plot saved as: {evictions_output}")

# Plot 2: Police Incidents
fig2, ax2 = plt.subplots(figsize=(16, 8))

for neighborhood in neighborhoods:
    counts = [police_data[neighborhood].get(month, 0) for month in all_months]
    ax2.plot(range(len(all_months)), counts, marker='o', linewidth=2, markersize=6,
             label=neighborhood.replace('_', ' '), color=colors[neighborhood], alpha=0.8)

ax2.set_xlabel('Month', fontsize=12, fontweight='bold')
ax2.set_ylabel('Number of Incidents', fontsize=12, fontweight='bold')
ax2.set_title('Police Incidents by Month (2022) - Memphis Neighborhoods',
              fontsize=14, fontweight='bold')
ax2.legend(loc='best', fontsize=10)
ax2.grid(True, alpha=0.3)
ax2.set_xticks(tick_positions)
ax2.set_xticklabels(tick_labels, rotation=45, ha='right')
plt.tight_layout()

# Save police plot
police_output = 'police_incidents_by_month_2022.png'
plt.savefig(police_output, dpi=300, bbox_inches='tight')
print(f"✓ Police incidents plot saved as: {police_output}")

# Show both plots
plt.show()

print("\n" + "=" * 80)
print("SUMMARY STATISTICS (2022)")
print("=" * 80)

print("\nEVICTIONS:")
for neighborhood in neighborhoods:
    total = sum(evictions_data[neighborhood].values())
    if total > 0:
        avg = total / 12
        print(f"  {neighborhood.replace('_', ' ')}: {total} total (avg {avg:.1f}/month)")

print("\nPOLICE INCIDENTS:")
for neighborhood in neighborhoods:
    total = sum(police_data[neighborhood].values())
    if total > 0:
        avg = total / 12
        print(f"  {neighborhood.replace('_', ' ')}: {total} total (avg {avg:.1f}/month)")

print("\n✓ Plots created successfully!")

# Generate numpy arrays for 2022 data only
print("\n" + "=" * 80)
print("NUMPY ARRAYS - 2022 DATA (4x12)")
print("=" * 80)
print("Rows: Neighborhoods (alphabetical)")
print("Columns: Months (Jan-Dec 2022)")
print("=" * 80)

# Generate months for 2022 only
months_2022 = []
for month in range(1, 13):
    months_2022.append(f"2022-{month:02d}")

# Sort neighborhoods alphabetically
neighborhoods_sorted = sorted(neighborhoods)

# Create evictions array for 2022
evictions_array_2022 = np.zeros((4, 12), dtype=int)
for i, neighborhood in enumerate(neighborhoods_sorted):
    for j, month in enumerate(months_2022):
        evictions_array_2022[i, j] = evictions_data[neighborhood].get(month, 0)

print("\nEVICTIONS ARRAY (2022):")
print(f"Neighborhoods: {[n.replace('_', ' ') for n in neighborhoods_sorted]}")
print(f"Shape: {evictions_array_2022.shape}")
print(evictions_array_2022)

# Create police incidents array for 2022
police_array_2022 = np.zeros((4, 12), dtype=int)
for i, neighborhood in enumerate(neighborhoods_sorted):
    for j, month in enumerate(months_2022):
        police_array_2022[i, j] = police_data[neighborhood].get(month, 0)

print("\nPOLICE INCIDENTS ARRAY (2022):")
print(f"Neighborhoods: {[n.replace('_', ' ') for n in neighborhoods_sorted]}")
print(f"Shape: {police_array_2022.shape}")
print(police_array_2022)

# Save arrays to files
np.save(str(PROJECT_ROOT / 'scripts' / 'evictions_2022_array.npy'), evictions_array_2022)
np.save(str(PROJECT_ROOT / 'scripts' / 'police_2022_array.npy'), police_array_2022)

print("\n" + "=" * 80)
print("ARRAYS SAVED")
print("=" * 80)
print("✓ evictions_2022_array.npy")
print("✓ police_2022_array.npy")
print("\nArray format:")
print("  Rows (4): Egypt, Frayser, Orange_Mound, Parkway_Village")
print("  Columns (12): Jan-Dec 2022")
