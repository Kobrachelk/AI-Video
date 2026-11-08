/* ============ Sipwi — main.js ============
 * Logic หลักของเว็บ + ระบบแชร์โซเชียล
 * โหลดในทุกหน้า แล้วเปิด API ผ่าน window.Sipwi
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'sipwi:lastPick';
  var SITE_NAME = 'Sipwi';

  /* ---------- Storage (ปลอดภัยแม้ localStorage ถูกบล็อก) ---------- */
  function savePick(pick) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(pick)); } catch (e) { /* ignore */ }
  }

  function loadPick() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  /* ---------- Toast ---------- */
  var toastTimer;
  function toast(message) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2200);
  }

  /* ---------- ข้อมูลที่จะแชร์ ----------
   * แต่ละหน้าสามารถเขียนทับได้ด้วย Sipwi.shareData = function () { return { text, url }; }
   */
  function defaultShareData() {
    var meta = document.querySelector('meta[name="description"]');
    return {
      text: (meta && meta.content) || SITE_NAME,
      url: location.href.split('#')[0]
    };
  }

  function getShareData() {
    var custom = typeof api.shareData === 'function' ? api.shareData() : null;
    var base = defaultShareData();
    return {
      text: (custom && custom.text) || base.text,
      url: (custom && custom.url) || base.url
    };
  }

  /* ---------- Helpers ---------- */
  function openPopup(url) {
    var w = 600, h = 560;
    var left = Math.max(0, (window.screen.width - w) / 2);
    var top = Math.max(0, (window.screen.height - h) / 2);
    var win = window.open(
      url,
      '_blank',
      'noopener,noreferrer,width=' + w + ',height=' + h + ',left=' + left + ',top=' + top
    );
    // ถ้าถูกบล็อกป๊อปอัป ให้เปิดในแท็บเดิมแทน
    if (!win) window.location.href = url;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy') ? resolve() : reject(new Error('copy failed'));
      } catch (e) {
        reject(e);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  /* ---------- Share ---------- */
  function share(target) {
    var data = getShareData();
    var text = data.text;
    var url = data.url;
    var eu = encodeURIComponent(url);
    var et = encodeURIComponent(text);

    switch (target) {
      case 'native':
        if (navigator.share) {
          navigator.share({ title: SITE_NAME, text: text, url: url }).catch(function (err) {
            if (err && err.name !== 'AbortError') toast('แชร์ไม่สำเร็จ ลองใหม่อีกครั้ง');
          });
        } else {
          share('copy');
        }
        break;
      case 'line':
        openPopup('https://social-plugins.line.me/lineit/share?url=' + eu + '&text=' + et);
        break;
      case 'facebook':
        openPopup('https://www.facebook.com/sharer/sharer.php?u=' + eu + '&quote=' + et);
        break;
      case 'x':
        openPopup('https://twitter.com/intent/tweet?text=' + et + '&url=' + eu);
        break;
      case 'copy':
        copyText(url).then(
          function () { toast('คัดลอกลิงก์แล้ว ✓'); },
          function () { toast('คัดลอกไม่สำเร็จ ลองกดค้างที่ลิงก์เอง'); }
        );
        break;
      default:
        break;
    }
  }

  function bindShareButtons() {
    var buttons = document.querySelectorAll('[data-share]');
    Array.prototype.forEach.call(buttons, function (btn) {
      // ซ่อนปุ่มแชร์ของระบบถ้าเบราว์เซอร์ไม่รองรับ
      if (btn.dataset.share === 'native' && !navigator.share) {
        btn.hidden = true;
        return;
      }
      btn.addEventListener('click', function () { share(btn.dataset.share); });
    });
  }

  /* ---------- หน้าหลัก: แสดงตัวละครล่าสุด ---------- */
  function renderLastPick() {
    var box = document.getElementById('lastPick');
    if (!box) return;
    var pick = loadPick();
    if (!pick || !pick.name) return;
    document.getElementById('lastPickEmoji').textContent = pick.emoji || '✨';
    document.getElementById('lastPickName').textContent = pick.name;
    if (pick.id) box.href = 'pages/characters.html?c=' + encodeURIComponent(pick.id);
    box.hidden = false;
  }

  /* ---------- Init ---------- */
  function init() {
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
    bindShareButtons();
    renderLastPick();
  }

  var api = {
    share: share,
    toast: toast,
    savePick: savePick,
    loadPick: loadPick,
    shareData: null // หน้าอื่นกำหนดทับได้
  };
  window.Sipwi = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
