import numpy as np
import csv
import os
from datetime import datetime
from collections import defaultdict
from itertools import combinations

# Directories
police_dir = 'C:/Users/nafla/Documents/memhack25/algo_guy/data/hoods_Police'
evictions_dir = 'C:/Users/nafla/Documents/memhack25/algo_guy/data/hoods_Evictions'

# Neighborhoods
neighborhoods = ['Egypt', 'Frayser', 'Parkway_Village', 'Orange_Mound']

# Generate months for 2022
months_2022 = []
for month in range(1, 13):
    months_2022.append(f"2022-{month:02d}")

print("=" * 80)
print("READING POLICE DATA BY CRIME CATEGORY (2022)")
print("=" * 80)

# Store data
crime_category_data = {neighborhood: defaultdict(lambda: defaultdict(int)) for neighborhood in neighborhoods}
evictions_data = {neighborhood: defaultdict(int) for neighborhood in neighborhoods}
all_categories = set()

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
                    year_month = offense_date.strftime('%Y-%m')
                    category = row['UCR Category'].strip()
                    crime_category_data[neighborhood][category][year_month] += 1
                    all_categories.add(category)
        
        print(f"  ✓ Found {len(crime_category_data[neighborhood])} crime categories")
        
    except FileNotFoundError:
        print(f"  ✗ File not found: {filepath}")

# Read Evictions Data
print("\nReading evictions data...")
for neighborhood in neighborhoods:
    filename = f"{neighborhood}.csv"
    filepath = os.path.join(evictions_dir, filename)
    
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file, delimiter=';')
            
            for row in reader:
                filing_date = datetime.strptime(row['Filing Date'], '%Y-%m-%d')
                
                if datetime(2022, 1, 1) <= filing_date <= datetime(2022, 12, 31):
                    year_month = filing_date.strftime('%Y-%m')
                    evictions_data[neighborhood][year_month] += 1
        
        total = sum(evictions_data[neighborhood].values())
        print(f"  ✓ {neighborhood}: {total} evictions")
        
    except FileNotFoundError:
        print(f"  ✗ File not found: {filepath}")

all_categories.add('EVICTIONS')

# Load blight data
print("\n" + "=" * 80)
print("LOADING BLIGHT DATA")
print("=" * 80)

service_requests_array = np.load('service_requests_2022_array.npy')
print(f"✓ Loaded service requests array: {service_requests_array.shape}")

neighborhoods_sorted = sorted(neighborhoods)

# Find categories that exist in ALL neighborhoods
print("\n" + "=" * 80)
print("FINDING SHARED CATEGORIES ACROSS ALL NEIGHBORHOODS")
print("=" * 80)

# Get categories for each neighborhood (including evictions)
neighborhood_categories = {}
for neighborhood in neighborhoods:
    neighborhood_categories[neighborhood] = set(crime_category_data[neighborhood].keys())
    neighborhood_categories[neighborhood].add('EVICTIONS')

# Find intersection - categories present in all neighborhoods
shared_categories = set.intersection(*neighborhood_categories.values())

print(f"Categories per neighborhood:")
for neighborhood in neighborhoods:
    print(f"  {neighborhood}: {len(neighborhood_categories[neighborhood])} categories")

print(f"\n✓ Shared categories across ALL neighborhoods: {len(shared_categories)}")
print(f"\nShared categories:")
for cat in sorted(shared_categories):
    print(f"  - {cat}")

max_combo_size = 12
print(f"\n✓ Maximum combination size to test: {max_combo_size}")

# Function to get category counts
def get_category_counts(neighborhood, category):
    if category == 'EVICTIONS':
        return np.array([evictions_data[neighborhood].get(month, 0) for month in months_2022])
    else:
        return np.array([crime_category_data[neighborhood][category].get(month, 0) for month in months_2022])

# Search through combinations
print("\n" + "=" * 80)
print(f"SEARCHING COMBINATIONS (1-{max_combo_size} SHARED CATEGORIES)")
print("=" * 80)

neighborhood_results = {}
combination_global_correlations = defaultdict(list)

for i, neighborhood in enumerate(neighborhoods_sorted):
    print(f"\n{neighborhood.replace('_', ' ')}:")
    print("-" * 80)
    
    blight = service_requests_array[i, :]
    
    # Use ONLY shared categories
    available_categories = sorted(list(shared_categories))
    
    print(f"  Using {len(available_categories)} shared categories")
    
    combination_results = []
    
    # Test combinations from size 1 to max_combo_size
    for combo_size in range(1, max_combo_size + 1):
        print(f"  Testing {combo_size}-category combinations...", end='')
        
        combo_count = 0
        for combo in combinations(available_categories, combo_size):
            combined_counts = np.zeros(12, dtype=int)
            
            for category in combo:
                category_counts = get_category_counts(neighborhood, category)
                combined_counts += category_counts
            
            corr = np.corrcoef(combined_counts, blight)[0, 1]
            total_incidents = combined_counts.sum()
            
            combo_key = frozenset(combo)
            
            result = {
                'categories': list(combo),
                'correlation': corr,
                'total_incidents': total_incidents,
                'combo_size': combo_size
            }
            
            combination_results.append(result)
            combination_global_correlations[combo_key].append((neighborhood, corr))
            combo_count += 1
        
        print(f" {combo_count} combinations")
    
    # Sort by correlation
    combination_results.sort(key=lambda x: x['correlation'], reverse=True)
    neighborhood_results[neighborhood] = combination_results
    
    print(f"  ✓ Tested {len(combination_results)} total combinations")

# Calculate average correlations
print("\n" + "=" * 80)
print("CALCULATING AVERAGE CORRELATIONS ACROSS NEIGHBORHOODS")
print("=" * 80)

average_correlations = []

for combo_key, hood_corrs in combination_global_correlations.items():
    # All combos should appear in all 4 neighborhoods since we used shared categories
    if len(hood_corrs) == 4:
        avg_corr = np.mean([corr for _, corr in hood_corrs])
        min_corr = min([corr for _, corr in hood_corrs])
        max_corr = max([corr for _, corr in hood_corrs])
        std_corr = np.std([corr for _, corr in hood_corrs])
        
        average_correlations.append({
            'categories': sorted(list(combo_key)),
            'avg_correlation': avg_corr,
            'min_correlation': min_corr,
            'max_correlation': max_corr,
            'std_correlation': std_corr,
            'combo_size': len(combo_key)
        })

# Sort by average correlation
average_correlations.sort(key=lambda x: x['avg_correlation'], reverse=True)

print(f"✓ Total combinations tested: {len(average_correlations)}")

# Display results
print("\n" + "=" * 80)
print("TOP 50 COMBINATIONS BY AVERAGE CORRELATION (ACROSS ALL NEIGHBORHOODS)")
print("=" * 80)

print(f"\n{'Rank':<6} {'Avg Corr':<10} {'Min':<8} {'Max':<8} {'Std':<8} {'Size':<6} Categories")
print("-" * 130)

for rank, result in enumerate(average_correlations[:50], 1):
    categories_str = ' + '.join(result['categories'])
    if len(categories_str) > 60:
        categories_str = categories_str[:57] + "..."
    
    print(f"{rank:<6} {result['avg_correlation']:>8.4f}  {result['min_correlation']:>6.4f}  {result['max_correlation']:>6.4f}  {result['std_correlation']:>6.4f}  {result['combo_size']:<6} {categories_str}")

# Show top by combo size
print("\n" + "=" * 80)
print("BEST COMBINATION FOR EACH SIZE")
print("=" * 80)

for size in range(1, max_combo_size + 1):
    size_combos = [c for c in average_correlations if c['combo_size'] == size]
    if size_combos:
        best = size_combos[0]
        print(f"\nSize {size}: Avg Correlation = {best['avg_correlation']:.4f}")
        print(f"  Categories: {' + '.join(best['categories'])}")

# Display top results per neighborhood
print("\n" + "=" * 80)
print("TOP 20 COMBINATIONS BY NEIGHBORHOOD")
print("=" * 80)

for neighborhood in neighborhoods_sorted:
    if neighborhood not in neighborhood_results:
        continue
    
    print(f"\n{neighborhood.replace('_', ' ')}:")
    print("-" * 100)
    
    results = neighborhood_results[neighborhood]
    
    print(f"{'Rank':<6} {'Corr':<10} {'Size':<6} {'Total':<8} Categories")
    print("-" * 100)
    
    for rank, result in enumerate(results[:20], 1):
        categories_str = ' + '.join(result['categories'])
        if len(categories_str) > 60:
            categories_str = categories_str[:57] + "..."
        
        print(f"{rank:<6} {result['correlation']:>8.4f}  {result['combo_size']:<6} {result['total_incidents']:<8} {categories_str}")

# Summary
print("\n" + "=" * 80)
print("OVERALL BEST COMBINATION")
print("=" * 80)

if average_correlations:
    best_overall = average_correlations[0]
    print(f"\nAverage Correlation: {best_overall['avg_correlation']:.4f}")
    print(f"Min Correlation: {best_overall['min_correlation']:.4f}")
    print(f"Max Correlation: {best_overall['max_correlation']:.4f}")
    print(f"Std Deviation: {best_overall['std_correlation']:.4f}")
    print(f"Combination size: {best_overall['combo_size']} categories")
    print(f"\nCategories:")
    for cat in best_overall['categories']:
        print(f"  - {cat}")

print("\n✓ Search complete!")