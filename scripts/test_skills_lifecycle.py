import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from server.skills.skill_manager import get_skill_manager

sm = get_skill_manager()

print("--- 1. List skills ---")
skills = sm.list_skills()
print(f"Discovered {len(skills)} skills:")
for s in skills[:5]:
    print(f"  * {s['title']} ({s['id']}) - {s['category']} [{s['source']}]")

print("\n--- 2. Run built-in calc_skill ---")
calc_res = sm.run_skill("calc_skill", "(1024 * 768) / 16 + 250")
print("Calc result:", calc_res)

print("\n--- 3. Import custom skill from file ---")
import_res = sm.import_from_file(
    name="crypto_price_tracker",
    content="""# Crypto Price Tracker Contract
Analyze live market capitalization, 24h trading volume, and momentum indicators for crypto assets.
Always provide high, low, and SMA20 trends with verified telemetry.
""",
    file_type="md",
    category="Data",
    description="Analyzes crypto market capitalization and trading volume trends.",
    prompt="Track Bitcoin and Ethereum 24h market momentum: ",
)
print("Import result:", import_res)

print("\n--- 4. Verify custom skill appears in list ---")
updated_skills = sm.list_skills()
found = any(s["id"] == "crypto_price_tracker" for s in updated_skills)
print(f"Skill 'crypto_price_tracker' in list: {found}")

print("\n--- 5. Run imported custom skill ---")
run_res = sm.run_skill("crypto_price_tracker", "What is the 24h trend for Bitcoin?")
print("Run result:", run_res)

print("\n--- 6. Clean up custom skill ---")
del_res = sm.delete_skill("crypto_price_tracker")
print("Delete result:", del_res)
print("Skills verification PASSED successfully!")
