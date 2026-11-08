/* ============ Sipwi — characters.js ============
 * Logic หน้าเลือกตัวละคร
 * แก้ไข/เพิ่มตัวละครได้ที่ CHARACTERS ด้านล่าง
 */
(function () {
  'use strict';

  var CHARACTERS = [
    { id: 'sunny',   emoji: '🦊', name: 'ซันนี่',  tagline: 'สดใส พลังบวกล้นเหลือ',     traits: ['ร่าเริง', 'ชวนคุย', 'ไอเดียเยอะ'] },
    { id: 'moon',    emoji: '🐱', name: 'มูน',     tagline: 'ใจเย็น นุ่มนวล',            traits: ['อบอุ่น', 'ช่างฟัง', 'รักสงบ'] },
    { id: 'blaze',   emoji: '🐯', name: 'เบลซ',    tagline: 'กล้าลุย ไม่กลัวอะไร',       traits: ['มั่นใจ', 'ผู้นำ', 'ลุยจริง'] },
    { id: 'sage',    emoji: '🦉', name: 'เซจ',     tagline: 'สุขุม รอบรู้ มองไกล',       traits: ['ฉลาด', 'รอบคอบ', 'ให้คำแนะนำเก่ง'] },
    { id: 'bubbles', emoji: '🐬', name: 'บับเบิ้ล', tagline: 'ขี้เล่น เข้ากับทุกคนได้',   traits: ['ขี้เล่น', 'เฟรนด์ลี่', 'ปรับตัวไว'] },
    { id: 'spark',   emoji: '🐼', name: 'สปาร์ค',  tagline: 'ใจดี ชิลล์ แต่ขยันเงียบ ๆ', traits: ['ใจดี', 'ชิลล์', 'พึ่งพาได้'] }
  ];

  var grid = document.getElementById('characterGrid');
  var result = document.getElementById('result');
  if (!grid || !result) return;

  var selectedId = null;

  function findById(id) {
    for (var i = 0; i < CHARACTERS.length; i++) {
      if (CHARACTERS[i].id === id) return CHARACTERS[i];
    }
    return null;
  }

  /* ---------- Render การ์ด ---------- */
  function makeCard(ch) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'card';
    btn.dataset.id = ch.id;
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', 'false');

    var emoji = document.createElement('span');
    emoji.className = 'card__emoji';
    emoji.textContent = ch.emoji;

    var name = document.createElement('span');
    name.className = 'card__name';
    name.textContent = ch.name;

    var tag = document.createElement('span');
    tag.className = 'card__tag';
    tag.textContent = ch.tagline;

    btn.appendChild(emoji);
    btn.appendChild(name);
    btn.appendChild(tag);
    btn.addEventListener('click', function () { select(ch.id, true); });
    return btn;
  }

  function renderGrid() {
    var frag = document.createDocumentFragment();
    CHARACTERS.forEach(function (ch) { frag.appendChild(makeCard(ch)); });
    grid.appendChild(frag);
  }

  /* ---------- เลือกตัวละคร ---------- */
  function shareUrlFor(id) {
    var u = new URL(location.href);
    u.search = '';
    u.hash = '';
    u.searchParams.set('c', id);
    return u.toString();
  }

  function select(id, userAction) {
    var ch = findById(id);
    if (!ch) return;
    selectedId = id;

    Array.prototype.forEach.call(grid.children, function (card) {
      card.setAttribute('aria-checked', card.dataset.id === id ? 'true' : 'false');
    });

    document.getElementById('resultEmoji').textContent = ch.emoji;
    document.getElementById('resultName').textContent = ch.name;
    document.getElementById('resultTagline').textContent = ch.tagline;

    var traits = document.getElementById('resultTraits');
    traits.textContent = '';
    ch.traits.forEach(function (t) {
      var li = document.createElement('li');
      li.textContent = t;
      traits.appendChild(li);
    });

    result.hidden = false;
    document.title = ch.name + ' — Sipwi';

    // จำตัวละคร + อัปเดตลิงก์ให้แชร์แล้วคนอื่นเปิดมาเจอตัวเดียวกัน
    window.Sipwi.savePick({ id: ch.id, name: ch.name, emoji: ch.emoji });
    try { history.replaceState(null, '', '?c=' + encodeURIComponent(ch.id)); } catch (e) { /* file:// บางเบราว์เซอร์ */ }

    if (userAction) {
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /* ---------- ข้อความที่ใช้แชร์ ---------- */
  window.Sipwi.shareData = function () {
    var ch = selectedId && findById(selectedId);
    if (!ch) return null;
    return {
      text: ch.emoji + ' ฉันได้ตัวละคร "' + ch.name + '" — ' + ch.tagline + ' แล้วคุณล่ะได้ตัวไหน?',
      url: shareUrlFor(ch.id)
    };
  };

  /* ---------- Init ---------- */
  renderGrid();

  var params = new URLSearchParams(location.search);
  var fromUrl = params.get('c');
  if (fromUrl && findById(fromUrl)) {
    select(fromUrl, false);
  }
})();
