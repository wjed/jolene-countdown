// will + jolene — shared Supabase client (loads only when needed)
var SUPABASE_URL = 'https://ocjqondxkscnrtjcqvsx.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9janFvbmR4a3NjbnJ0amNxdnN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NDExMTcsImV4cCI6MjA4NzIxNzExN30.Ac5Me_JASuyn0LbCm1uV7U44VUVT_KXJw1D2zwCio1E';
var supabaseClient = null;

function getSupabase(cb) {
  if (supabaseClient) { cb(supabaseClient); return; }
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
  s.onload = function() {
    try {
      supabaseClient = (window.supabase && window.supabase.createClient) ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
    } catch (e) { supabaseClient = null; }
    cb(supabaseClient);
  };
  s.onerror = function() { cb(null); };
  document.head.appendChild(s);
}

// Photo list for photos page
var PHOTOS = [
  'images/IMG_0321.jpg', 'images/IMG_0972.jpg', 'images/IMG_0993.jpg', 'images/IMG_6354.jpg',
  'images/IMG_6732.jpg', 'images/IMG_6780.jpg', 'images/IMG_6786.jpg', 'images/IMG_6830.jpg',
  'images/IMG_6831.jpg', 'images/IMG_6832.jpg', 'images/IMG_7253.jpg', 'images/IMG_7653.jpg',
  'images/IMG_9225.jpg', 'images/IMG_9627.jpg'
];

// Logo paths — put your school/gym logos in images/ with these names (or update paths here)
var LOGOS = {
  jmu: 'school_logos/jmu_logo.png',
  pennState: 'school_logos/psu_logo.png',
  urec: 'gyms/urec.png',
  planetFitness: 'gyms/pf.png'
};

// Mobile nav toggle (run after DOM ready)
function initNavToggle() {
  var btn = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (btn && links) btn.addEventListener('click', function() { links.classList.toggle('open'); });
}

// Dark mode: apply saved theme and init toggle
var THEME_KEY = 'will-jolene-theme';
function getTheme() {
  try {
    var s = localStorage.getItem(THEME_KEY);
    if (s === 'dark' || s === 'light') return s;
  } catch (e) {}
  return 'light';
}
function setTheme(mode) {
  var root = document.documentElement;
  root.setAttribute('data-theme', mode);
  try { localStorage.setItem(THEME_KEY, mode); } catch (e) {}
  var btn = document.getElementById('themeToggle');
  if (btn) {
    btn.setAttribute('aria-label', mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    var icon = btn.querySelector('i');
    if (icon) icon.className = mode === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
  }
}
function initTheme() {
  setTheme(getTheme());
  var btn = document.getElementById('themeToggle');
  if (btn) btn.addEventListener('click', function() {
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initNavToggle();
  });
} else {
  initTheme();
  initNavToggle();
}
