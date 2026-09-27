import json
import os
from datetime import datetime, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

import requests
from dotenv import load_dotenv


TIMEZONE = ZoneInfo("America/Sao_Paulo")
PROJECT_DIR = Path(__file__).resolve().parents[1]
OUTPUT_FILE = PROJECT_DIR / "public" / "data" / "hybrid-charge.json"

load_dotenv(PROJECT_DIR / ".env")

HOST = "api-mifit-us3.zepp.com"
APP_TOKEN = os.getenv("ZEPP_APP_TOKEN")
URL = f"https://{HOST}/v2/users/me/events"

headers = {
    "apptoken": APP_TOKEN,
    "appname": "com.xiaomi.hm.health",
    "appplatform": "ios_phone",
    "user-agent": "Zepp/10.2.5 (iPhone; iOS 26.3.1; Scale/3.00)",
}

now = datetime.now(timezone.utc)
now_ms = int(now.timestamp() * 1000)
seven_days_ago_ms = now_ms - (7 * 24 * 60 * 60 * 1000)

response = requests.get(
    URL,
    headers=headers,
    params={
        "eventType": "Charge",
        "subType": "real_Data",
        "from": str(seven_days_ago_ms),
        "to": str(now_ms),
    },
    timeout=30,
)
response.raise_for_status()
response_json = response.json()

samples = []
for item in response_json.get("items", []):
    value = item.get("value", {})
    start_time = value.get("startTime")
    if start_time is None:
        continue

    for sample in value.get("samples", []):
        try:
            timestamp = int(start_time) + int(sample["s"])
            mental = float(sample["mental"])
            physical = float(sample["physical"])
        except (KeyError, TypeError, ValueError):
            continue

        samples.append(
            {
                "timestamp": timestamp,
                "mental": mental,
                "physical": physical,
            }
        )

samples.sort(key=lambda sample: sample["timestamp"])
recent_samples = samples[-10:]

if recent_samples:
    hp = sum(sample["physical"] for sample in recent_samples) / len(recent_samples)
    mp = sum(sample["mental"] for sample in recent_samples) / len(recent_samples)
    hp = round(max(0, min(100, hp)), 1)
    mp = round(max(0, min(100, mp)), 1)
    first_sample_ms = recent_samples[0]["timestamp"]
    first_sample = datetime.fromtimestamp(first_sample_ms / 1000, tz=TIMEZONE)
    first_sample_iso = first_sample.isoformat()
else:
    hp = -1
    mp = -1
    first_sample_iso = None

status_data = {
    "hp": hp,
    "mp": mp,
    "sampleCount": len(recent_samples),
    "from": first_sample_iso,
    "source": "Hybrid Charge / Zepp / T-Rex 3",
}

OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
OUTPUT_FILE.write_text(
    json.dumps(status_data, ensure_ascii=False, indent=2),
    encoding="utf-8",
)

if first_sample_iso:
    print(f"Primeira leitura considerada: {first_sample.strftime('%d/%m/%Y %H:%M:%S %Z')}")
for sample in recent_samples:
    sample_time = datetime.fromtimestamp(sample["timestamp"] / 1000, tz=TIMEZONE)
    print(
        f"Time: {sample_time}, Mental: {sample['mental']}, "
        f"Physical: {sample['physical']}"
    )
print(f"HP médio: {hp} | MP médio: {mp} | Leituras: {len(recent_samples)}")
print(f"Arquivo atualizado: {OUTPUT_FILE}")
