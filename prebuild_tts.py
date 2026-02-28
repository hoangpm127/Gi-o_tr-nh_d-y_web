"""
prebuild_tts.py — Tạo toàn bộ audio TTS offline dùng Microsoft Edge TTS
Hoàn toàn miễn phí, không cần API key.
Giọng: vi-VN-HoaiMyNeural (nữ, tiếng Việt)

Cài trước: pip install edge-tts
Chạy 1 lần: python prebuild_tts.py
Hoặc 1 buổi: python prebuild_tts.py buoi1.html
"""

import re, json, os, sys, asyncio
import edge_tts

EDGE_VOICE = 'vi-VN-HoaiMyNeural'
BUOI_FILES = ['buoi1.html','buoi2.html','buoi3.html','buoi4.html','buoi5.html']

# ── Helpers ───────────────────────────────────────────────────────────────────

async def _gen(text, outpath):
    """edge-tts tạo MP3 trực tiếp, không cần API key."""
    communicate = edge_tts.Communicate(text, EDGE_VOICE)
    await communicate.save(outpath)

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

        print(f'  [{i+1:02d}/{len(texts)}] Tao...    {label}')
        try:
            asyncio.run(_gen(text, mp3_path))
            size_kb = os.path.getsize(mp3_path) // 1024
            print(f'             -> {mp3_name} ({size_kb} KB)')
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
    print('Prebuild TTS (edge-tts / vi-VN-HoaiMyNeural)')
    print(f'Target: {targets}')
    for f in targets:
        if os.path.exists(f):
            process_file(f)
        else:
            print(f'\nKhông tìm thấy file: {f}')
    print('\n\nHoàn tất!')
