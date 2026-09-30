"""Generate date-based display checks from a reviewed IANA archive, not host tzdata.

Requires Python 3.9+ and zic. Run:
  python3 scripts/import-offset-fixtures.py /path/to/tzdata2026e.tar.gz
"""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import tarfile
import tempfile
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

VERSION = '2026e'
YEAR = 2027
SOURCES = ['africa', 'antarctica', 'asia', 'australasia', 'europe',
           'northamerica', 'southamerica', 'etcetera', 'backward']
ZONES = '''Africa/Cairo Africa/Casablanca Africa/El_Aaiun
America/Asuncion America/Bahia_Banderas America/Chihuahua America/Ciudad_Juarez
America/Coyhaique America/Mazatlan America/Merida America/Mexico_City
America/Monterrey America/Nuuk America/Ojinaga America/Punta_Arenas
America/Santiago America/Scoresbysund America/New_York America/Phoenix
America/Vancouver America/Edmonton America/Inuvik America/Winnipeg
America/Los_Angeles America/Denver America/Chicago
Antarctica/Casey Antarctica/Troll Antarctica/Vostok
Asia/Almaty Asia/Amman Asia/Damascus Asia/Qostanay Asia/Tomsk Asia/Omsk
Australia/Lord_Howe Europe/Astrakhan Europe/Ulyanovsk Europe/Dublin Europe/Moscow
Pacific/Fiji Pacific/Galapagos Pacific/Honolulu Pacific/Port_Moresby
Pacific/Bougainville Pacific/Norfolk Etc/UTC Etc/GMT'''.split()


def generate(archive_path):
    dates = [datetime(YEAR, month, 15, 12, tzinfo=timezone.utc) for month in range(1, 13)]
    result = {
        'tzdbVersion': VERSION,
        'source': f'https://data.iana.org/time-zones/releases/tzdata{VERSION}.tar.gz',
        'sha256': hashlib.sha256(archive_path.read_bytes()).hexdigest(),
        'year': YEAR,
        'scope': 'Display offsets for sampled dates; not historical or transition-rule validation.',
        'dates': [date.isoformat().replace('+00:00', 'Z') for date in dates],
        'conventions': {
            'Europe/Dublin': 'Winter GMT is standard; summer IST is daylight, reversing IANA negative-DST flags.',
            'Africa/Casablanca': '2026e models permanent UTC+0 from 2026-09-20; earlier Ramadan rules are outside this snapshot.',
            'Africa/El_Aaiun': 'Same post-2026-09-20 convention as Casablanca.'
        },
        'zones': {}
    }
    with tempfile.TemporaryDirectory(prefix='timezone-soft-tz-') as temp:
        root = Path(temp)
        with tarfile.open(archive_path) as archive:
            version = archive.extractfile('version').read().decode().strip()
            if version != VERSION:
                raise ValueError(f'Expected tzdata{VERSION}, got {version}; review the version and fixture scope first')
            # Only named source files are read; archive paths are never extracted.
            for name in SOURCES:
                (root / name).write_bytes(archive.extractfile(name).read())
        output = root / 'zoneinfo'
        output.mkdir()
        # Fat output avoids older zic slim-file bugs with recent permanent-offset rules.
        subprocess.run(['zic', '-b', 'fat', '-d', str(output)] +
                       [str(root / name) for name in SOURCES], check=True)
        for zone_id in sorted(ZONES):
            with (output / zone_id).open('rb') as source:
                zone = ZoneInfo.from_file(source, key=zone_id)
            samples = []
            for date in dates:
                local = date.astimezone(zone)
                daylight = bool(local.dst())
                if zone_id == 'Europe/Dublin':
                    daylight = not daylight
                field = 'daylight' if daylight else 'standard'
                samples.append([local.utcoffset().total_seconds() / 3600, field])
            record = {}
            for field in ['standard', 'daylight']:
                offsets = {offset for offset, category in samples if category == field}
                if len(offsets) > 1 or (field == 'standard' and not offsets):
                    raise ValueError(f'{zone_id}: needs an explicit display convention for {field}: {offsets}')
                record[field] = next(iter(offsets)) if offsets else None
            record['samples'] = samples
            result['zones'][zone_id] = record
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('archive', type=Path)
    args = parser.parse_args()
    fixture = generate(args.archive)
    destination = Path(__file__).resolve().parents[2] / 'test/fixtures/offsets-2026e.json'
    destination.write_text(json.dumps(fixture, indent=2) + '\n')
    print(f'Wrote {len(fixture["zones"])} zones × {len(fixture["dates"])} dates to {destination}')
