"""
prebuild_tts.py — Tải toàn bộ audio TTS về local để chạy offline
Chạy 1 lần: python prebuild_tts.py
Kết quả:
  - audio/buoi1/ ... audio/buoi5/  ← file MP3
  - Mỗi buoiX.html được patch thêm TTS_PRELOAD, không cần gọi API nữa
"""

import re, json, os, time, sys
import urllib.request, urllib.error

FPT_KEY   = 'XNZzpBQVWhTOCRc7MhOGbezPQznkhNew'
FPT_VOICE = 'banmai'
FPT_SPEED = '0'          # neutral speed cho bản lưu; người dùng có thể đổi tốc độ sau
BUOI_FILES = ['buoi1.html','buoi2.html','buoi3.html','buoi4.html','buoi5.html']

# ── Helpers ───────────────────────────────────────────────────────────────────

def fpt_get_url(text):
    """Gọi FPT API, trả về audio URL (string)."""
    body = text.encode('utf-8')
    req = urllib.request.Request(
        'https://api.fpt.ai/hmi/tts/v5',
        data=body,
        headers={'api-key': FPT_KEY, 'speed': FPT_SPEED, 'voice': FPT_VOICE},
        method='POST'
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode('utf-8'))
    url = data.get('async') or data.get('url')
    if not url:
        raise ValueError(f'FPT trả về không có URL: {data}')
    return url

def download_mp3(audio_url, outpath, retries=6, wait=2):
    """Tải MP3 từ URL về file (FPT cần vài giây để generate)."""
    for attempt in range(retries):
        try:
            urllib.request.urlretrieve(audio_url, outpath)
            size = os.path.getsize(outpath)
            if size > 500:          # file hợp lệ
                return True
            os.remove(outpath)      # file rỗng / lỗi — thử lại
        except Exception:
            pass
        print(f'      chờ {wait}s rồi thử lại ({attempt+1}/{retries})...')
        time.sleep(wait)
    return False

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

def process_file(html_file):
    print(f'\n{"="*60}')
    print(f'  {html_file}')
    print(f'{"="*60}')

    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Bỏ qua nếu đã patch rồi
    if 'const TTS_PRELOAD' in content:
        print('  Đã có TTS_PRELOAD — bỏ qua (xóa khối TTS_PRELOAD nếu muốn rebuild)')
        return

    # Trích xuất SLIDES JSON
    m = re.search(r'const SLIDES\s*=\s*(\[[\s\S]*?\]);\s*\n// ── Build', content)
    if not m:
        print('  LỖI: Không tìm thấy const SLIDES!')
        return
    try:
        slides = json.loads(m.group(1))
    except json.JSONDecodeError as e:
        print(f'  LỖI parse JSON: {e}')
        return

    texts = extract_texts(slides)
    print(f'  Tổng text cần tải: {len(texts)}')

    buoi_num = re.search(r'buoi(\d+)', html_file).group(1)
    audio_dir = os.path.join('audio', f'buoi{buoi_num}')
    os.makedirs(audio_dir, exist_ok=True)

    preload_map = {}   # text → relative path

    for i, text in enumerate(texts):
        mp3_name = f'tts_{i:03d}.mp3'
        mp3_path = os.path.join(audio_dir, mp3_name)
        rel_path = f'audio/buoi{buoi_num}/{mp3_name}'
        label = text[:55] + ('…' if len(text) > 55 else '')

        # Đã tải rồi → dùng lgailuôn
        if os.path.exists(mp3_path) and os.path.getsize(mp3_path) > 500:
            print(f'  [{i+1:02d}/{len(texts)}] Cache ✓  {label}')
            preload_map[text] = rel_path
            continue

        print(f'  [{i+1:02d}/{len(texts)}] Gọi API… {label}')
        try:
            audio_url = fpt_get_url(text)
            time.sleep(2)                   # đợi FPT generate
            ok = download_mp3(audio_url, mp3_path)
            if ok:
                size_kb = os.path.getsize(mp3_path) // 1024
                print(f'           → {mp3_name} ({size_kb} KB)')
                preload_map[text] = rel_path
            else:
                print(f'           → THẤT BẠI sau nhiều lần thử')
        except Exception as e:
            print(f'           → LỖI: {e}')

        time.sleep(0.8)     # tránh rate limit

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
    print('Prebuild TTS — tải audio về local')
    print(f'Target: {targets}')
    for f in targets:
        if os.path.exists(f):
            process_file(f)
        else:
            print(f'\nKhông tìm thấy file: {f}')
    print('\n\nHoàn tất!')
