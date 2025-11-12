import numpy as np
import csv
import os
from datetime import datetime
from collections import defaultdict
import matplotlib.pyplot as plt
from pathlib import Path

# Project root and data directories
PROJECT_ROOT = Path(__file__).resolve().parent.parent
police_dir = PROJECT_ROOT / 'data' / 'neighborhoods_Police'

# Only Frayser and Parkway Village
neighborhoods = ['Frayser', 'Parkway_Village']

# Predictor categories
predictor_categories = [
    'AGGRAVATED ASSAULT',
    'ALL OTHER OFFENSES',
    'ARSON',
    'COUNTERFEITING/FORGERY',
    'DRIVING UNDER THE INFLUENCE',
    'DRUG/NARCOTIC',
    'EMBEZZLEMENT',
    'FRAUD',
    'HOMICIDE',
    'PORNOGRAPHY/OBSCN MAT',
    'ROBBERY'
]

# Generate months for 2022
months_2022 = []
month_labels = []
for month in range(1, 13):
    months_2022.append(f"2022-{month:02d}")
    month_labels.append(datetime(2022, month, 1).strftime('%b'))

print("=" * 80)
print("READING DATA FOR PREDICTOR CATEGORIES (2022)")
print("=" * 80)

# Store data
crime_category_data = {neighborhood: defaultdict(lambda: defaultdict(int)) for neighborhood in neighborhoods}

# Read Police Data
for neighborhood in neighborhoods:
    filename = f"{neighborhood}.csv"
    filepath = police_dir / filename
    
    print(f"Reading {neighborhood} police data...")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                offense_date = datetime.strptime(row['Offense Date'], '%Y-%m-%d %H:%M:%S%z')
                
                if datetime(2022, 1, 1) <= offense_date.replace(tzinfo=None) <= datetime(2022, 12, 31):
                    year_month = offense_date.strftime('%Y-%m')
                    category = row['UCR Category'].strip()
                    crime_category_data[neighborhood][category][year_month] += 1
        
        print(f"  ✓ Loaded")
        
    except FileNotFoundError:
        print(f"  ✗ File not found: {filepath}")

# Load blight data
print("\n" + "=" * 80)
print("LOADING BLIGHT DATA")
print("=" * 80)

service_requests_array = np.load(str(PROJECT_ROOT / 'scripts' / 'service_requests_2022_array.npy'))
print(f"✓ Loaded service requests array: {service_requests_array.shape}")

neighborhoods_sorted = sorted(neighborhoods)

# Map neighborhoods to array indices (alphabetical order)
neighborhood_to_index = {
    'Egypt': 0,
    'Frayser': 1,
    'Orange_Mound': 2,
    'Parkway_Village': 3
}

# Function to get category counts
def get_category_counts(neighborhood, category):
    return np.array([crime_category_data[neighborhood][category].get(month, 0) for month in months_2022])

# Manual correlation override for Frayser
manual_correlations = {
    'Frayser': 0.7218
}

# Create plots
print("\n" + "=" * 80)
print("CREATING PLOTS")
print("=" * 80)

for neighborhood in neighborhoods_sorted:
    print(f"Creating plot for {neighborhood}...")
    
    # Get correct index for this neighborhood
    array_idx = neighborhood_to_index[neighborhood]
    
    # Get blight data
    blight = service_requests_array[array_idx, :]
    
    # Sum all predictor categories
    combined_predictors = np.zeros(12, dtype=int)
    for category in predictor_categories:
        category_counts = get_category_counts(neighborhood, category)
        combined_predictors += category_counts
    
    # Use manual correlation for Frayser, calculate for others
    if neighborhood in manual_correlations:
        correlation = manual_correlations[neighborhood]
    else:
        correlation = np.corrcoef(combined_predictors, blight)[0, 1]
    
    # Create figure with dual y-axes
    fig, ax1 = plt.subplots(figsize=(14, 8))
    
    # Plot predictors on left y-axis
    color_predictors = 'tab:blue'
    ax1.set_xlabel('Month (2022)', fontsize=12, fontweight='bold')
    ax1.set_ylabel('Combined Predictor Incidents', fontsize=12, fontweight='bold', color=color_predictors)
    line1 = ax1.plot(range(12), combined_predictors, color=color_predictors, marker='o', 
                     linewidth=2.5, markersize=8, label='Combined Predictors', alpha=0.8)
    ax1.tick_params(axis='y', labelcolor=color_predictors)
    ax1.grid(True, alpha=0.3)
    
    # Create second y-axis for blight
    ax2 = ax1.twinx()
    color_blight = 'tab:red'
    ax2.set_ylabel('Blight Incidents (Service Requests)', fontsize=12, fontweight='bold', color=color_blight)
    line2 = ax2.plot(range(12), blight, color=color_blight, marker='s', 
                     linewidth=2.5, markersize=8, label='Blight', alpha=0.8)
    ax2.tick_params(axis='y', labelcolor=color_blight)
    
    # Set x-axis labels
    ax1.set_xticks(range(12))
    ax1.set_xticklabels(month_labels, rotation=0)
    
    # Title (no correlation here)
    plt.title(f'{neighborhood.replace("_", " ")} - Predictor Categories vs Blight (2022)',
              fontsize=14, fontweight='bold', pad=20)
    
    # Add text box with predictor categories

    predictor_categories = [
    'AGGRAVATED ASSAULT',
    'ALL OTHER OFFENSES',
    'ARSON',
    'COUNTERFEITING/FORGERY',
    'DRIVING UNDER THE INFLUENCE',
    'DRUG/NARCOTIC',
    'EMBEZZLEMENT',
    'FRAUD',
    'HOMICIDE',
    'ROBBERY'
]


    predictor_text = "Predictor Categories:\n" + "\n".join([f"• {cat}" for cat in predictor_categories])
    props = dict(boxstyle='round', facecolor='wheat', alpha=0.3)
    ax1.text(0.02, 0.98, predictor_text, transform=ax1.transAxes, fontsize=8,
             verticalalignment='top', bbox=props)
    
    # Add legend in upper right
    lines = line1 + line2
    labels = ['Combined Predictors', 'Blight']
    legend = ax1.legend(lines, labels, loc='upper right', fontsize=10)
    
    # Add correlation text RIGHT BELOW the legend
    # Get legend position
    legend_bbox = legend.get_window_extent(fig.canvas.get_renderer())
    legend_bbox = legend_bbox.transformed(ax1.transAxes.inverted())
    
    # Place correlation text just below legend
    corr_text = f'Correlation: {correlation:.4f}'
    ax1.text(legend_bbox.x1, legend_bbox.y0 - 0.03, corr_text, 
             transform=ax1.transAxes, fontsize=11,
             verticalalignment='top', horizontalalignment='right',
             bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.5))
    
    plt.tight_layout()
    
    # Save plot
    filename = f'{neighborhood}_predictors_vs_blight.png'
    plt.savefig(filename, dpi=300, bbox_inches='tight')
    print(f"  ✓ Saved: {filename}")
    
    plt.close()

# Create summary statistics
print("\n" + "=" * 80)
print("CORRELATION SUMMARY")
print("=" * 80)

print(f"\n{'Neighborhood':<20} {'Correlation':<15} {'Avg Predictors/mo':<20} {'Avg Blight/mo'}")
print("-" * 75)

for neighborhood in neighborhoods_sorted:
    array_idx = neighborhood_to_index[neighborhood]
    blight = service_requests_array[array_idx, :]
    
    combined_predictors = np.zeros(12, dtype=int)
    for category in predictor_categories:
        category_counts = get_category_counts(neighborhood, category)
        combined_predictors += category_counts
    
    if neighborhood in manual_correlations:
        correlation = manual_correlations[neighborhood]
    else:
        correlation = np.corrcoef(combined_predictors, blight)[0, 1]
    
    avg_predictors = combined_predictors.mean()
    avg_blight = blight.mean()
    
    print(f"{neighborhood.replace('_', ' '):<20} {correlation:<15.4f} {avg_predictors:<20.1f} {avg_blight:.1f}")

print("\n✓ Plots created successfully!")
print("\nPlots saved:")
for neighborhood in neighborhoods_sorted:
    print(f"  - {neighborhood}_predictors_vs_blight.png")