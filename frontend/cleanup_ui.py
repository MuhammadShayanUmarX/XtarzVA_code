import os
import re

directories = [
    r"c:\Users\win10\Documents\XtarzVA-new\XtarzVA-main\frontend\src\pages\dashboard",
    r"c:\Users\win10\Documents\XtarzVA-new\XtarzVA-main\frontend\src\components\dashboard",
    r"c:\Users\win10\Documents\XtarzVA-new\XtarzVA-main\frontend\src\components\layout",
    r"c:\Users\win10\Documents\XtarzVA-new\XtarzVA-main\frontend\src\components\steps",
    r"c:\Users\win10\Documents\XtarzVA-new\XtarzVA-main\frontend\src\components\workflows",
]

replacements = {
    # Typography & Glows
    r"shadow-glow(-\w+)?": "",
    r"shadow-\[0_0_[^\]]+\]": "",
    r"uppercase tracking-widest": "tracking-tight",
    r"uppercase tracking-\[0\.[0-9]+em\]": "tracking-tight",
    r"font-black text-\[10px\]": "font-bold text-xs",
    r"font-black text-\[11px\]": "font-bold text-sm",
    
    # Colors
    r"text-brand-50\b": "text-landing-primary",
    r"text-brand-100\b": "text-landing-primary",
    r"text-brand-200\b": "text-landing-secondary",
    r"text-brand-300\b": "text-landing-secondary",
    r"text-brand-400\b": "text-landing-secondary",
    r"text-brand-500\b": "text-landing-muted",
    r"text-brand-600\b": "text-landing-muted",
    r"text-brand-700\b": "text-landing-muted",
    r"text-brand-800\b": "text-landing-muted",
    r"text-brand-900\b": "text-landing-muted",
    r"text-brand-950\b": "text-landing-muted",
    
    r"bg-brand-950\b": "bg-landing-bg",
    r"bg-brand-900\b": "bg-landing-surface",
    r"bg-brand-850\b": "bg-landing-elevated",
    r"bg-brand-800\b": "bg-landing-elevated",
    r"bg-brand-700\b": "bg-landing-elevated",
    
    r"border-white/5": "border-landing-divider",
    r"border-white/10": "border-landing-divider",
    r"border-white/20": "border-landing-divider",
    r"border-brand-[0-9]+": "border-landing-divider",
    
    r"bg-gradient-cta": "bg-landing-accent hover:bg-landing-accent/90",
    r"text-accent-primary": "text-landing-accent",
    r"bg-accent-primary": "bg-landing-accent",
    r"border-accent-primary": "border-landing-accent",
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for pattern, repl in replacements.items():
        new_content = re.sub(pattern, repl, new_content)
        
    # Clean up double spaces created by empty replacements
    new_content = re.sub(r'  +', ' ', new_content)
    new_content = new_content.replace('className=" ', 'className="')
    new_content = new_content.replace(' "', '"')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")

for d in directories:
    if os.path.exists(d):
        for root, _, files in os.walk(d):
            for file in files:
                if file.endswith('.tsx') or file.endswith('.ts'):
                    process_file(os.path.join(root, file))
