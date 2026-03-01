"""
prebuild_tts.py — Tạo toàn bộ audio TTS offline dùng Gemini 2.5 Flash TTS
Giọng: Sulafat (Warm) + prompt giọng nữ Hà Nội trẻ trung

Cài trước: pip install google-genai
Chạy 1 lần: python prebuild_tts.py
Hoặc 1 buổi: python prebuild_tts.py buoi1.html
"""

import re, json, os, sys, wave, time
from google import genai
from google.genai import types

# 3 keys moi toanh
GEMINI_API_KEYS = [
    'AIzaSyCznC3qcW7uBIPJF4RNOyNUafLYXfO79-o',  # new key 1
    'AIzaSyBm8s9z5ftkVvDC0HnLnJEvI39ki_OqS_Q',  # new key 2
    'AIzaSyDgxeygtAYyt-uivsqJ3vPRzh16drQcZjA',  # new key 3
]
# Old keys (holding):
# 'AIzaSyAFAPgr2BtPE8r5PPplsJnmTK_cInVCmrA'
# 'AIzaSyDrYW7XgKV3Kv8wb0j2VqyRVuttGwu1hUY'
# 'AIzaSyB-0xsANvhlcZ3O4inTeofzEntDoP-PQ1E'
# 'AIzaSyABJ0dhD5pkU__xDAWUFET8NIswjKqIbbA'
# 'AIzaSyCbkNKCnsz1KUnU0X7DFhWsUOtX2IdZm4s'
# 'AIzaSyCaheYvSbUGPC10Bj9HiXSNjrz4Uhr5smE'
# 'AIzaSyCHEfzHmLR1qjWmyFq3btUjOnrOPrzOD70'
# 'AIzaSyDI0Mmfp71G8XRkM1CU9gLWyCYdXtOWyN8'
# 'AIzaSyBQReDKTu-X8X6YqzRLRKXxAtxp8Fn5yAM'
# 'AIzaSyDotyp_lgVmiOBkrfwT2Ex2QkdqT01LUWE'
# 'AIzaSyBmZGseb4Qpl58Ie2Hb02zDFdyDyC30zPM'
# 'AIzaSyCC4tuW8iioma6qCGY1uHi3vT4BFbcokng'
# 'AIzaSyAe5hQbWcP1a3uqylLz4a5-WQXfnPnAcVI'
GEMINI_VOICE   = 'Sulafat'
GEMINI_MODEL   = 'gemini-2.5-flash-preview-tts'

VOICE_PROMPT_PREFIX = (
    "# AUDIO PROFILE: Co Linh - Giao vien tre Ha Noi\n\n"
    "### DIRECTOR'S NOTES\n"
    "Style: Giong nu tre trung, de thuong, than thien, nhiet tinh. "
    "Nhu co giao tre Ha Noi day hoc online, vui ve, cuon hut, ro rang.\n"
    "Accent: Northern Vietnamese - Hanoi accent. Chuan Bac, ro rang, khong pha giong mien Nam.\n"
    "Pacing: Vua phai, ngat nghi tu nhien, de hieu.\n\n"
    "### TRANSCRIPT\n"
)

BUOI_FILES = ['buoi1.html','buoi2.html','buoi3.html','buoi4.html','buoi5.html']

# Key rotation pool
_clients = [genai.Client(api_key=k) for k in GEMINI_API_KEYS]
_key_idx = 0  # key dang dung hien tai
_key_cooldown = [0.0] * len(GEMINI_API_KEYS)  # thoi diem key duoc phep dung lai

def get_next_client():
    """Tra ve (idx, client) cua key san sang som nhat."""
    global _key_idx
    now = time.time()
    # Tim key het cooldown
    for i in range(len(_clients)):
        idx = (_key_idx + i) % len(_clients)
        if now >= _key_cooldown[idx]:
            _key_idx = (idx + 1) % len(_clients)
            return idx, _clients[idx]
    # Tat ca dang cooldown — cho key gan het han nhat
    wait_idx = min(range(len(_clients)), key=lambda i: _key_cooldown[i])
    wait_sec = _key_cooldown[wait_idx] - now + 0.5
    print(f'  [keys] Tat ca {len(_clients)} keys dang cooldown, cho {wait_sec:.0f}s...')
    time.sleep(wait_sec)
    _key_idx = (wait_idx + 1) % len(_clients)
    return wait_idx, _clients[wait_idx]

# ── Helpers ───────────────────────────────────────────────────────────────────

def _gen(text, outpath, max_true_attempts=5):
    """Gemini TTS tao WAV. Key rotation: khi key bi 429 chuyen key khac.
    max_true_attempts: so lan thu that su (khong tinh lan bi 429)."""
    true_attempts = 0
    while true_attempts < max_true_attempts:
        key_idx, client = get_next_client()  # tu cho khi tat ca cooldown
        try:
            resp = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=VOICE_PROMPT_PREFIX + text,
                config=types.GenerateContentConfig(
                    response_modalities=["AUDIO"],
                    speech_config=types.SpeechConfig(
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=GEMINI_VOICE)
                        ),
                        language_code="vi-VN",
                    ),
                ),
            )
            pcm = resp.candidates[0].content.parts[0].inline_data.data
            with wave.open(outpath, "wb") as wf:
                wf.setnchannels(1)
                wf.setsampwidth(2)
                wf.setframerate(24000)
                wf.writeframes(pcm)
            return len(pcm)
        except Exception as e:
            err = str(e)
            if '429' in err or 'RESOURCE_EXHAUSTED' in err:
                # Lay retryDelay tu API, them 15s buffer
                m = re.search(r"retryDelay.*?'(\d+(?:\.\d+)?)s'", err)
                api_delay = float(m.group(1)) if m else 60.0
                cooldown = api_delay + 15
                _key_cooldown[key_idx] = time.time() + cooldown
                print(f'  [key{key_idx+1}] 429 -> cooldown {cooldown:.0f}s')
                # Khong tang true_attempts — day la rate limit, khong phai loi
            else:
                true_attempts += 1
                print(f'  [key{key_idx+1}] Loi khac (lan {true_attempts}): {err[:80]}')
                if true_attempts >= max_true_attempts:
                    raise
    raise RuntimeError(f'Het {max_true_attempts} lan thu that su')

def extract_texts(slides):
    """Lấy tất cả narration + feedback text từ SLIDES array."""
    seen, texts = set(), []
    def add(t):
        t = t.strip()
        if t and t not in seen:
            seen.add(t)
            texts.append(t)
    for s in slides:
        add(s.get('narration','') or s.get('question',''))
        for opt in s.get('options', []):
            add(opt.get('feedback',''))
    return texts

def js_escape(text):
    return text.replace('\\','\\\\').replace("'","\\'").replace('\n','\\n').replace('\r','')

# ── Main per-file logic ───────────────────────────────────────────────────────

def strip_old_preload(content):
    """Xoa khoi TTS_PRELOAD cu neu co, tra ve content sach."""
    # Xoa: const TTS_PRELOAD = {...};\n\nconst ttsCache...seed lines
    pattern = re.compile(
        r"const TTS_PRELOAD = \{[\s\S]*?\};\s*\n+"
        r"const ttsCache = new Map\(\);\s*\n"
        r"// Seed cache.*?\n"
        r"Object\.entries\(TTS_PRELOAD\)\.forEach.*?\n",
        re.MULTILINE
    )
    cleaned = pattern.sub('const ttsCache = new Map();\n', content)
    return cleaned

def process_file(html_file):
    print(f'\n{"="*60}')
    print(f'  {html_file}')
    print(f'{"="*60}')

    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Neu da co TTS_PRELOAD cu (edge-tts mp3) thi strip truoc
    if 'const TTS_PRELOAD' in content:
        print('  Xoa TTS_PRELOAD cu (edge-tts)...')
        content = strip_old_preload(content)

    # Trích xuất SLIDES JSON
    m = re.search(r'const SLIDES\s*=\s*(\[[\s\S]*?\]);\s*\n// ── Build', content)
    if not m:
        print('  LOI: Khong tim thay const SLIDES!')
        return
    try:
        slides = json.loads(m.group(1))
    except json.JSONDecodeError as e:
        print(f'  LOI parse JSON: {e}')
        return

    texts = extract_texts(slides)
    print(f'  Tong text can tao: {len(texts)}')

    buoi_num = re.search(r'buoi(\d+)', html_file).group(1)
    audio_dir = os.path.join('audio', f'buoi{buoi_num}')
    os.makedirs(audio_dir, exist_ok=True)

    preload_map = {}   # text → relative path

    for i, text in enumerate(texts):
        wav_name = f'tts_{i:03d}.wav'
        wav_path = os.path.join(audio_dir, wav_name)
        rel_path = f'audio/buoi{buoi_num}/{wav_name}'
        label = text[:55] + ('...' if len(text) > 55 else '')

        # Da co file tot roi → dung lai
        if os.path.exists(wav_path) and os.path.getsize(wav_path) > 2000:
            print(f'  [{i+1:02d}/{len(texts)}] Cache OK  {label}')
            preload_map[text] = rel_path
            continue

        print(f'  [{i+1:02d}/{len(texts)}] Tao...    {label}')
        try:
            size = _gen(text, wav_path)
            size_kb = os.path.getsize(wav_path) // 1024
            print(f'             -> {wav_name} ({size_kb} KB, {size/2/24000:.1f}s)')
            preload_map[text] = rel_path
        except Exception as e:
            print(f'             -> LOI: {e}')

    if not preload_map:
        print('  Không có file nào tải được — không patch HTML')
        return

    # ── Patch HTML ────────────────────────────────────────
    lines = ['const TTS_PRELOAD = {']
    for text, path in preload_map.items():
        lines.append(f"  '{js_escape(text)}': '{path}',")
    lines.append('};')
    preload_block = '\n'.join(lines)

    # Chèn vào trước "const ttsCache" và thêm 1 dòng seed cache
    patch = (
        preload_block + '\n\n'
        'const ttsCache = new Map();\n'
        '// Seed cache từ audio offline\n'
        'Object.entries(TTS_PRELOAD).forEach(([t,u])=>ttsCache.set(t,u));'
    )
    new_content = content.replace('const ttsCache = new Map();', patch, 1)

    if new_content == content:
        print('  CẢNH BÁO: Không tìm thấy "const ttsCache" — chưa patch được')
        return

    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f'\n  ✅ Patch xong {html_file} — {len(preload_map)}/{len(texts)} texts offline')

# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == '__main__':
    targets = sys.argv[1:] if len(sys.argv) > 1 else BUOI_FILES
    print(f'Prebuild TTS (Gemini 2.5 Flash TTS / {GEMINI_VOICE} / vi-VN Hanoi)')
    print(f'Target: {targets}')
    for f in targets:
        if os.path.exists(f):
            process_file(f)
        else:
            print(f'\nKhong tim thay file: {f}')
    print('\n\nHoan Tat!')
