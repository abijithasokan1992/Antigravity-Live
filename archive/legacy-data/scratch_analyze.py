import json
import glob
import os

data_dir = r"c:\Users\User\Desktop\Project Antigravity"
files = glob.glob(os.path.join(data_dir, "*.json"))

print("JSON files found:")
for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            data = json.load(file)
            print(f"- {os.path.basename(f)}: {len(data)} records")
            if len(data) > 0:
                print(f"  Sample keys: {list(data[0].keys())}")
    except Exception as e:
        print(f"Error reading {f}: {e}")
