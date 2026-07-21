import json
import collections

data_dir = r"c:\Users\User\Desktop\Project Antigravity"
def load(f):
    with open(f"{data_dir}/{f}", "r", encoding="utf-8") as file:
        return json.load(file)

drafts = load("films_filmdraft.json")
films = load("films_film.json")
users = load("accounts_user.json")
mappings = load("films_filmbuyermapping.json")
payments = load("films_payment.json")

print("--- 1. The draft funnel ---")
no_title = [d for d in drafts if not d.get("title")]
video_tab = [d for d in drafts if d.get("current_tab") == "video"]
no_main_video = [d for d in drafts if not d.get("main_video")]
owner_counts = collections.Counter([d.get("uploaded_by_id") for d in drafts])
top_owner = owner_counts.most_common(1)[0] if owner_counts else (None, 0)
print(f"Total Drafts: {len(drafts)}")
print(f"No Title: {len(no_title)}")
print(f"Stuck at video tab: {len(video_tab)}")
print(f"Zero main_video: {len(no_main_video)}")
print(f"Top owner ID: {top_owner[0]} with {top_owner[1]} drafts")

print("\n--- 2. Buyer Mappings ---")
mapped_by = collections.Counter([m.get("mapped_by_id") for m in mappings])
buyer_actions = sum(1 for m in mappings if m.get("download_requested") or m.get("film_info_requested") or m.get("trailer_download_requested"))
print(f"Total mappings: {len(mappings)}")
print(f"Mapped by IDs: {dict(mapped_by)}")
print(f"Buyer actions taken: {buyer_actions}")
allow_download = sum(1 for m in mappings if m.get("allow_download"))
print(f"Download allowed: {allow_download}")

print("\n--- 3. Users / Data Cleaning ---")
emails = [u.get("email") for u in users if u.get("email")]
phone_in_email = [u for u in users if u.get("email") and u.get("email").isdigit()]
emails_in_phone = [u for u in users if u.get("phone") and "@" in u.get("phone")]
phone_admin = [u for u in users if str(u.get("phone")).lower() == "admin"]
print(f"Total Users: {len(users)}")
print(f"Emails in phone field: {len(emails_in_phone)}")
print(f"Phone 'admin': {len(phone_admin)}")

print("\n--- 4. Jananam 1947 ---")
jananam = next((f for f in films if "Jananam" in str(f.get("title"))), None)
if jananam:
    print(f"Distribution Territories: {jananam.get('distribution_territories')}")
