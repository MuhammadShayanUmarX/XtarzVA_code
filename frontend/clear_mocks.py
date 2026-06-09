import os
import re

files_to_clear = [
    r"c:\Users\win10\Documents\XtarzVA-new\XtarzVA-main\frontend\src\pages\dashboard\InsightsPage.tsx",
    r"c:\Users\win10\Documents\XtarzVA-new\XtarzVA-main\frontend\src\pages\dashboard\RunResultsPage.tsx",
    r"c:\Users\win10\Documents\XtarzVA-new\XtarzVA-main\frontend\src\pages\dashboard\OverviewPage.tsx",
]

for filepath in files_to_clear:
    if not os.path.exists(filepath):
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if "InsightsPage.tsx" in filepath:
        content = re.sub(r'const MARKET_INSIGHTS = \[.*?\];', 'const MARKET_INSIGHTS: any[] = [];', content, flags=re.DOTALL)
        content = re.sub(r'const PREDICTIVE_DATA = \[.*?\];', 'const PREDICTIVE_DATA: any[] = [];', content, flags=re.DOTALL)
    
    if "RunResultsPage.tsx" in filepath:
        content = re.sub(r'const PRODUCTS = \[.*?\];', 'const PRODUCTS: any[] = [];', content, flags=re.DOTALL)
        content = re.sub(r'const PERFORMANCE_DATA = \[.*?\];', 'const PERFORMANCE_DATA: any[] = [];', content, flags=re.DOTALL)

    if "OverviewPage.tsx" in filepath:
        content = re.sub(r"value: '[^']+'", "value: '0'", content)
        content = re.sub(r"trend: '[^']+'", "trend: '0%'", content)
        content = re.sub(r"delta: '[^']+'", "delta: '0%'", content)
        content = re.sub(r"data: \[\{.*?\}\]", "data: []", content)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Mock data cleared.")
