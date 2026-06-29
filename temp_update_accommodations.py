import json
from pathlib import Path

root = Path('public/data')
old_path = root / 'v2' / 'accommodities.json'
new_path = root / 'v3' / 'accommodities.json'

with old_path.open(encoding='utf-8') as f:
    old_data = json.load(f)

base_records = [
    {
        'id': 1,
        'accommodationName': {'en': 'Homestay', 'ar': 'الإقامة مع عائلة'},
        'accommodationDescription': {'en': 'Accommodation package', 'ar': 'باقة الإقامة'},
        'image': None,
        'accommodationCategoryId': 1,
        'note': {'en': '', 'ar': ''},
        'minimumAge': 16,
        'durationWeeks': None,
        'accommodationDates': None,
        'schoolId': 1,
    },
    {
        'id': 2,
        'accommodationName': {'en': 'Residences', 'ar': 'السكن الطلابي'},
        'accommodationDescription': {'en': 'Accommodation package', 'ar': 'باقة الإقامة'},
        'image': None,
        'accommodationCategoryId': 2,
        'note': {'en': '', 'ar': ''},
        'minimumAge': 18,
        'durationWeeks': None,
        'accommodationDates': None,
        'schoolId': 1,
    },
    {
        'id': 3,
        'accommodationName': {'en': 'Student Residence', 'ar': 'سكن طلابي'},
        'accommodationDescription': {'en': 'Accommodation package', 'ar': 'باقة الإقامة'},
        'image': None,
        'accommodationCategoryId': 2,
        'note': {'en': '', 'ar': ''},
        'minimumAge': 18,
        'durationWeeks': None,
        'accommodationDates': None,
        'schoolId': 2,
    },
    {
        'id': 4,
        'accommodationName': {'en': 'Homestay', 'ar': 'سكن مع عائلة'},
        'accommodationDescription': {'en': 'Accommodation package', 'ar': 'باقة الإقامة'},
        'image': None,
        'accommodationCategoryId': 1,
        'note': {'en': '', 'ar': ''},
        'minimumAge': 16,
        'durationWeeks': None,
        'accommodationDates': None,
        'schoolId': 2,
    },
    {
        'id': 5,
        'accommodationName': {'en': 'Student Residence', 'ar': 'سكن طلابي'},
        'accommodationDescription': {'en': 'Accommodation package', 'ar': 'باقة الإقامة'},
        'image': None,
        'accommodationCategoryId': 2,
        'note': {'en': '', 'ar': ''},
        'minimumAge': 18,
        'durationWeeks': None,
        'accommodationDates': None,
        'schoolId': 3,
    },
    {
        'id': 6,
        'accommodationName': {'en': 'Homestay', 'ar': 'سكن مع عائلة'},
        'accommodationDescription': {'en': 'Accommodation package', 'ar': 'باقة الإقامة'},
        'image': None,
        'accommodationCategoryId': 1,
        'note': {'en': '', 'ar': ''},
        'minimumAge': 16,
        'durationWeeks': None,
        'accommodationDates': None,
        'schoolId': 3,
    },
    {
        'id': 7,
        'accommodationName': {'en': 'Student Residence', 'ar': 'سكن طلابي'},
        'accommodationDescription': {'en': 'Accommodation package', 'ar': 'باقة الإقامة'},
        'image': None,
        'accommodationCategoryId': 2,
        'note': {'en': '', 'ar': ''},
        'minimumAge': 18,
        'durationWeeks': None,
        'accommodationDates': None,
        'schoolId': 4,
    },
    {
        'id': 8,
        'accommodationName': {'en': 'Homestay', 'ar': 'سكن مع عائلة'},
        'accommodationDescription': {'en': 'Accommodation package', 'ar': 'باقة الإقامة'},
        'image': None,
        'accommodationCategoryId': 1,
        'note': {'en': '', 'ar': ''},
        'minimumAge': 16,
        'durationWeeks': None,
        'accommodationDates': None,
        'schoolId': 4,
    },
    {
        'id': 9,
        'accommodationName': {'en': 'Homestay', 'ar': 'سكن مع عائلة'},
        'accommodationDescription': {'en': 'Accommodation package', 'ar': 'باقة الإقامة'},
        'image': None,
        'accommodationCategoryId': 1,
        'note': {'en': '', 'ar': ''},
        'minimumAge': 16,
        'durationWeeks': None,
        'accommodationDates': None,
        'schoolId': 5,
    },
    {
        'id': 10,
        'accommodationName': {'en': 'Residences (Age 18+)', 'ar': 'سكن طلابي (عمر 18+)'},
        'accommodationDescription': {'en': 'Accommodation package', 'ar': 'باقة الإقامة'},
        'image': None,
        'accommodationCategoryId': 2,
        'note': {'en': '', 'ar': ''},
        'minimumAge': 18,
        'durationWeeks': None,
        'accommodationDates': None,
        'schoolId': 5,
    },
    {
        'id': 11,
        'accommodationName': {'en': 'Residences (Age 16+)', 'ar': 'سكن طلابي (عمر 16+)'},
        'accommodationDescription': {'en': 'Accommodation package', 'ar': 'باقة الإقامة'},
        'image': None,
        'accommodationCategoryId': 2,
        'note': {'en': '', 'ar': ''},
        'minimumAge': 16,
        'durationWeeks': None,
        'accommodationDates': None,
        'schoolId': 5,
    },
]

packages_by_school = {}
for school_entry in old_data:
    school_id = school_entry.get('schoolId')
    packages_by_school.setdefault(school_id, []).extend(school_entry.get('accPackages', []))

result = []
for record in base_records:
    school_id = record['schoolId']
    name = record['accommodationName']
    name_en = (name.get('en') or '').strip().lower()
    name_ar = (name.get('ar') or '').strip().lower()
    matched_package = None

    for pkg in packages_by_school.get(school_id, []):
        pkg_name = pkg.get('packageName', {})
        pkg_en = (pkg_name.get('en') or '').strip().lower()
        pkg_ar = (pkg_name.get('ar') or '').strip().lower()
        if pkg_en and (pkg_en == name_en or pkg_en in name_en or name_en in pkg_en):
            matched_package = pkg
            break
        if pkg_ar and (pkg_ar == name_ar or pkg_ar in name_ar or name_ar in pkg_ar):
            matched_package = pkg
            break

    if matched_package is None and packages_by_school.get(school_id):
        matched_package = packages_by_school[school_id][0]

    room_plans = []
    first_room = None
    for room in (matched_package or {}).get('roomTypes', []) or []:
        if first_room is None:
            first_room = room
        plan_amounts = [
            item.get('amount')
            for item in room.get('roomPlans', []) or []
            if isinstance(item, dict) and isinstance(item.get('amount'), (int, float))
        ]
        if not plan_amounts:
            plan_amounts = [0]
        frequency = 'weekly'
        for item in room.get('roomPlans', []) or []:
            if isinstance(item, dict) and item.get('frequency'):
                frequency = item.get('frequency')
                break
        room_plans.append({
            'planName': room.get('roomName') or matched_package.get('packageName') or record['accommodationName'],
            'amount': min(plan_amounts),
            'frequency': frequency,
            'optional': False,
        })

    if not room_plans:
        room_plans = [{
            'planName': record['accommodationName'],
            'amount': 0,
            'frequency': 'weekly',
            'optional': False,
        }]

    result.append({
        **record,
        'price': min(item['amount'] for item in room_plans),
        'priceFrequency': room_plans[0]['frequency'],
        'location': first_room.get('location') if first_room else None,
        'commuteOptions': first_room.get('commuteOptions') if first_room else None,
        'accommodationPlans': room_plans,
    })

new_path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'wrote {len(result)} accommodations to {new_path}')
