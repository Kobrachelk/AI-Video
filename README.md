# Sipwi

เว็บไซต์เลือกตัวละคร พร้อมปุ่มแชร์ผลลัพธ์ลงโซเชียล (LINE, Facebook, X, แชร์ของระบบมือถือ, คัดลอกลิงก์)
เป็นเว็บแบบ static ล้วน (HTML + CSS + JavaScript) ไม่ต้องติดตั้งอะไรเพิ่ม

## โครงสร้างโปรเจกต์

```
sipwi/
├── index.html                 ← หน้าหลัก
├── pages/
│   └── characters.html        ← หน้าเลือกตัวละคร
├── css/
│   └── style.css
├── js/
│   ├── main.js                ← Logic หลัก + แชร์โซเชียล
│   └── characters.js          ← Logic หน้าตัวละคร
└── README.md
```

## วิธีรันในเครื่อง

เปิดไฟล์ `index.html` ด้วยเบราว์เซอร์ได้ทันที หรือรันเซิร์ฟเวอร์ในเครื่อง (แนะนำ):

```bash
cd sipwi
python3 -m http.server 8000
# แล้วเปิด http://localhost:8000
```

> หมายเหตุ: ปุ่มแชร์และปุ่มคัดลอกลิงก์จะใช้งานได้เต็มที่เมื่อเว็บอยู่บน `http://localhost` หรือ `https://` เท่านั้น
> (การเปิดแบบ `file://` จะแชร์ลิงก์ที่คนอื่นเปิดไม่ได้)

## วิธีแก้ไข / เพิ่มตัวละคร

เปิด `js/characters.js` แล้วแก้อาร์เรย์ `CHARACTERS` ที่ด้านบนของไฟล์:

```js
{ id: 'sunny', emoji: '🦊', name: 'ซันนี่', tagline: 'สดใส พลังบวกล้นเหลือ', traits: ['ร่าเริง', 'ชวนคุย', 'ไอเดียเยอะ'] }
```

- `id` — ต้องไม่ซ้ำกัน (ใช้ในลิงก์แชร์ เช่น `characters.html?c=sunny`)
- `emoji` — ไอคอนตัวละคร (อยากใช้รูปแทน ให้ปรับ `makeCard()` และส่วนแสดงผลลัพธ์)
- `name`, `tagline`, `traits` — ชื่อ, คำอธิบายสั้น, คุณลักษณะ

## ระบบแชร์โซเชียล

ปุ่มแชร์ทุกปุ่มใช้ `data-share="..."` และผูกอัตโนมัติโดย `js/main.js`:

| ค่า `data-share` | การทำงาน |
|---|---|
| `native` | เมนูแชร์ของมือถือ (ซ่อนอัตโนมัติถ้าเบราว์เซอร์ไม่รองรับ) |
| `line` | แชร์ผ่าน LINE |
| `facebook` | แชร์ผ่าน Facebook |
| `x` | แชร์ผ่าน X (Twitter) |
| `copy` | คัดลอกลิงก์ |

ข้อความและลิงก์ที่แชร์ตั้งได้ต่อหน้า:

```js
Sipwi.shareData = function () {
  return { text: 'ข้อความที่ต้องการแชร์', url: 'https://example.com/...' };
};
```

## นำขึ้น GitHub และเปิดเป็นเว็บ (GitHub Pages)

1. สร้าง repository ใหม่บน GitHub เช่นชื่อ `sipwi`
2. อัปโหลดไฟล์ทั้งหมดโดยคงโครงสร้างโฟลเดอร์ไว้ (ตามโครงสร้างด้านบน) ด้วยวิธีใดวิธีหนึ่ง
   - บนเว็บ: **Add file → Upload files** แล้วลากทั้งโฟลเดอร์เข้าไป หรือ **Add file → Create new file**
     แล้วพิมพ์ path เช่น `pages/characters.html` เพื่อสร้างโฟลเดอร์ย่อยพร้อมวางโค้ด
   - ในเครื่อง:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/<username>/sipwi.git
     git push -u origin main
     ```
3. ไปที่ **Settings → Pages** เลือก Source เป็น **Deploy from a branch** แล้วเลือก Branch `main` โฟลเดอร์ `/ (root)` กด **Save**
4. รอประมาณ 1–2 นาที เว็บจะอยู่ที่ `https://<username>.github.io/sipwi/`

ทุกลิงก์ในโปรเจกต์เป็นแบบ relative จึงทำงานได้ทั้งบน GitHub Pages ที่มีชื่อ repo ต่อท้าย URL และบนโดเมนของตัวเอง
นอกจาก GitHub Pages แล้ว ยังอัปโหลดทั้งโฟลเดอร์ไปโฮสต์ static อื่นได้ เช่น Netlify, Cloudflare Pages โดยไม่ต้อง build

เพื่อให้ลิงก์แชร์แสดงตัวอย่าง (รูป/ชื่อ) สวยบนโซเชียล แนะนำให้เพิ่มแท็ก `og:image` และ `og:url`
ใน `<head>` ของแต่ละหน้า โดยใช้ URL เต็มของเว็บจริง
