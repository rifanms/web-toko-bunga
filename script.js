const STORAGE_PRODUCTS = 'flower-shop-products';
const STORAGE_ORDERS = 'flower-shop-orders';
const STORAGE_SYNC = 'flower-shop-products-sync';

// ============================================================
// SECURITY LAYER — XSS Protection, Input Sanitization
// Mengikuti OWASP Top 10 best practices
// ============================================================

/**
 * Sanitasi HTML untuk mencegah XSS
 * Escape karakter berbahaya sebelum dimasukkan ke DOM
 */
function escHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitasi input teks — hapus karakter berbahaya
 * Dipakai sebelum menyimpan ke Supabase
 */
function sanitizeInput(str, maxLen = 500) {
  if (!str) return '';
  return String(str)
    .trim()
    .slice(0, maxLen)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:text\/html/gi, '');
}

/**
 * Validasi nomor telepon Indonesia
 */
function isValidPhone(phone) {
  return /^(\+62|62|0)[0-9]{8,13}$/.test(phone.replace(/\s|-/g, ''));
}

/**
 * Validasi email
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Rate limiter sederhana — mencegah spam order/request
 */
const _rateLimits = {};
function rateLimit(key, maxReq = 5, windowMs = 60000) {
  const now = Date.now();
  if (!_rateLimits[key]) _rateLimits[key] = [];
  _rateLimits[key] = _rateLimits[key].filter(t => now - t < windowMs);
  if (_rateLimits[key].length >= maxReq) return false;
  _rateLimits[key].push(now);
  return true;
}

// Supabase config — key diambil dari config.js (tidak di-commit ke GitHub)
const SUPABASE_URL = (window.APP_CONFIG && window.APP_CONFIG.SUPABASE_URL) || '';
const SUPABASE_ANON = (window.APP_CONFIG && window.APP_CONFIG.SUPABASE_ANON_KEY) || '';

let supabaseClient = null;
try {
  if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  }
} catch(e) { supabaseClient = null; }

// BroadcastChannel for cross-tab sync
let PRODUCT_BC = null;
let ORDER_BC = null;
try{
  if(typeof BroadcastChannel !== 'undefined') {
    PRODUCT_BC = new BroadcastChannel('flower-shop-products');
    ORDER_BC = new BroadcastChannel('flower-shop-orders');
  }
}catch(err){}

const defaultProducts = [
  {id:1,name:'Rose bucket',price:1850000,categoryLabel:'Signature Bouquet',category:'bridal',desc:'Mawar merah, daftar hijau gelap, dan pita satin ivory untuk momen penuh pesona.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=1200&q=80'},
  {id:2,name:'Blanc Éternel',price:3200000,categoryLabel:'Wedding Collection',category:'events',desc:'Rangkaian bridal klasik berwarna putih dan hijau, cocok untuk acara pernikahan mewah.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1530092285049-1c42085fd395?w=1200&q=80'},
  {id:3,name:'Jardin Secret',price:2450000,categoryLabel:'Event Centerpiece',category:'events',desc:'Sentuhan floral artistik dengan bunga segar dan rangkaian natural untuk meja utama.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80'},
  {id:4,name:'Roses du Matin',price:980000,categoryLabel:'Subscription Box',category:'subscription',subscription:true,desc:'Langganan bunga bulanan yang dikirim dalam kemasan luxe dengan aroma segar sehari-hari.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=1200&q=80'},
  {id:5,name:'Velvet Evening',price:2150000,categoryLabel:'Luxury Bouquet',category:'luxury',desc:'Rangkaian velvet merah tua, mawar, dan ranunculus untuk hadiah romantis eksklusif.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=1200&q=80'},
  {id:6,name:'Golden Whisper',price:2750000,categoryLabel:'Signature Display',category:'luxury',desc:'Palet emas hangat dengan bunga lily dan mawar kuning, sempurna untuk acara premium.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1536061442026-85aac5ae7cdf?w=1200&q=80'},
  {id:7,name:'Midnight Bloom',price:1990000,categoryLabel:'Evening Collection',category:'gifting',desc:'Perpaduan bunga gelap dan tekstur lembut yang menonjol dalam kemasan hitam aksen emas.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=1200&q=80'},
  {id:8,name:'Pearl & Petal',price:1420000,categoryLabel:'Romantic Gift',category:'gifting',desc:'Set bunga putih mutiara dengan detail pita satin dan kartu ucapan elegan.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1468327768560-75b778c5cbad?w=1200&q=80'},
  {id:9,name:'Opaline Garden',price:1320000,categoryLabel:'Bridal Bouquet',category:'bridal',desc:'Rangkaian mawar putih, eustoma, dan baby breath untuk tampilan minimalis, bersih, dan anggun.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=1200&q=80'},
  {id:10,name:'Champagne Blossom',price:2600000,categoryLabel:'Celebration',category:'events',desc:'Buket cerah dengan sentuhan champagne dan daun eucalyptus untuk momen bahagia.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1530092285049-1c42085fd395?w=1200&q=80'},
  {id:11,name:'Mauve Luxe',price:2250000,categoryLabel:'Luxury Bouquet',category:'luxury',desc:'Campuran bunga lavender, mawar dusty pink, dan lisianthus dalam nuansa lembut mewah.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80'},
  {id:12,name:'Velvet Dawn',price:1980000,categoryLabel:'Event Arrangement',category:'events',desc:'Rangkaian tebal dengan mawar merah anggur dan iris ungu untuk gala dan dinner eksklusif.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=1200&q=80'},
  {id:13,name:'Satin Wish',price:1150000,categoryLabel:'Gift Bundle',category:'gifting',desc:'Paduan bunga pink pastel dan kemasan satin untuk hadiah ulang tahun atau hari kasih sayang.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=1200&q=80'},
  {id:14,name:'Noir Petals',price:2890000,categoryLabel:'Luxury Display',category:'luxury',desc:'Sentuhan gelap elegan dengan mawar hitam dan daun hijau pekat untuk suasana dramatis.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1536061442026-85aac5ae7cdf?w=1200&q=80'},
  {id:15,name:'Ivory Charm',price:1350000,categoryLabel:'Bridal Bouquet',category:'bridal',desc:'Putih murni dan beige dengan aksen dedaunan hijau lembut, cocok untuk pengantin modern.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=1200&q=80'},
  {id:16,name:'Golden Hour',price:2450000,categoryLabel:'Event Centerpiece',category:'events',desc:'Komposisi hangat oranye dan emas untuk pesta intim dan acara premium.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1468327768560-75b778c5cbad?w=1200&q=80'},
  {id:17,name:'Petal Promise',price:1790000,categoryLabel:'Romantic Gift',category:'gifting',desc:'Buket kecil manis dengan mawar peach dan freesia, sempurna untuk surprise love.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=1200&q=80'},
  {id:18,name:'Silk Bouquet',price:2250000,categoryLabel:'Luxury Bouquet',category:'luxury',desc:'Skema warna blush dan creamy dengan kemasan velvet, mengesankan presentasi premium.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1530092285049-1c42085fd395?w=1200&q=80'},
  {id:19,name:'Lilac Dream',price:2100000,categoryLabel:'Bridal Collection',category:'bridal',desc:'Warna lilac dan ungu dengan aksen bayi breath, feminin dan elegan untuk pengantin.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80'},
  {id:20,name:'Autumn Muse',price:2200000,categoryLabel:'Event Display',category:'events',desc:'Palet musim gugur dengan bunga oranye dan merah, hangat untuk event intimate.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=1200&q=80'},
  {id:21,name:'Moonlight Spell',price:1790000,categoryLabel:'Luxury Bouquet',category:'luxury',desc:'Mawar putih, eucalyptus, dan ornament perak menciptakan kesan mewah bernuansa malam.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=1200&q=80'},
  {id:22,name:'Secret Garden',price:1680000,categoryLabel:'Bridal Bouquet',category:'bridal',desc:'Campuran bunga gardenia, mawar, dan daun hijau yang lembut untuk rasa klasik.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1536061442026-85aac5ae7cdf?w=1200&q=80'},
  {id:23,name:'Sapphire Gala',price:2890000,categoryLabel:'Luxury Centerpiece',category:'luxury',desc:'Komposisi biru dan putih dengan aksen silver untuk pesta formal.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=1200&q=80'},
  {id:24,name:'Rosé Affair',price:1420000,categoryLabel:'Gift Bouquet',category:'gifting',desc:'Buket rosegold menawan yang ideal sebagai hadiah anniversary atau ucapan terima kasih.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1468327768560-75b778c5cbad?w=1200&q=80'},
  {id:25,name:'Cashmere White',price:1990000,categoryLabel:'Subscription Box',category:'subscription',subscription:true,desc:'Paket eksklusif bulanan dengan bunga putih halus dan nuansa krem yang menenangkan.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=1200&q=80'},
  {id:26,name:'Coral Moment',price:1720000,categoryLabel:'Event Bouquet',category:'events',desc:'Bunga coral lembut yang memberi aksen ceria pada acara siang hari.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1530092285049-1c42085fd395?w=1200&q=80'},
  {id:27,name:'Velvet Blush',price:2150000,categoryLabel:'Luxury Bouquet',category:'luxury',desc:'Kombinasi bunga blush pink dan velvet merah, mewah dan romantis.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80'},
  {id:28,name:'Bloom & Bespoke',price:1430000,categoryLabel:'Gift Set',category:'gifting',desc:'Set bunga + kartu personal dengan kemasan hitam gold untuk hadiah elegan.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=1200&q=80'},
  {id:29,name:'Ivory Romance',price:2380000,categoryLabel:'Bridal Accent',category:'bridal',desc:'Rangkaian ivory premium dengan detail bridal lace untuk momen sakral.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=1200&q=80'},
  {id:30,name:'Golden Symphony',price:2850000,categoryLabel:'Luxury Event',category:'luxury',desc:'Ornamen emas dan mawar putih menciptakan centerpiece yang memikat.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1536061442026-85aac5ae7cdf?w=1200&q=80'},
  {id:31,name:'Aurora Glow',price:1290000,categoryLabel:'Gift Bouquet',category:'gifting',desc:'Pilihan bunga peach dan cream dengan kemasan premium untuk special gift.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=1200&q=80'},
  {id:32,name:'Rosewood Elegance',price:2620000,categoryLabel:'Event Centerpiece',category:'events',desc:'Aksen kayu dan bunga merah anggur untuk suasana intimate dan hangat.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1468327768560-75b778c5cbad?w=1200&q=80'},
  {id:33,name:'Silk & Satin',price:2190000,categoryLabel:'Luxury Bouquet',category:'luxury',desc:'Warna dusty rose dan gold yang memancarkan kemewahan halus.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=1200&q=80'},
  {id:34,name:'Golden Petal',price:1990000,categoryLabel:'Subscription Box',category:'subscription',subscription:true,desc:'Langganan edisi khusus dengan bunga emas hangat setiap bulan.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1530092285049-1c42085fd395?w=1200&q=80'},
  {id:35,name:'Secret Whisper',price:1780000,categoryLabel:'Bridal Bouquet',category:'bridal',desc:'Rangkaian natural dan wildflowers untuk pengantin yang menyukai kebebasan.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80'},
  {id:36,name:'Midnight Luxe',price:2970000,categoryLabel:'Luxury Display',category:'luxury',desc:'Komposisi bunga gelap dan metalik cocok untuk gala eksklusif.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=1200&q=80'},
  {id:37,name:'Summer Serenade',price:1480000,categoryLabel:'Event Bouquet',category:'events',desc:'Skema bunga kuning dan hijau muda untuk event musim panas yang segar.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=1200&q=80'},
  {id:38,name:'Opal Nights',price:2090000,categoryLabel:'Luxury Bouquet',category:'luxury',desc:'Mawar ivory dan aksen emas muda menciptakan kesan elegan lembut.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1536061442026-85aac5ae7cdf?w=1200&q=80'},
  {id:39,name:'Garden Whisper',price:1220000,categoryLabel:'Gift Bouquet',category:'gifting',desc:'Detail greenery dan bunga pink cerah untuk hadiah yang manis.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=1200&q=80'},
  {id:40,name:'Serene Petals',price:1340000,categoryLabel:'Subscription Box',category:'subscription',subscription:true,desc:'Pilihan soothing bunga netral yang dikirim rutin untuk suasana nyaman.',img:'foto/asset/3.jpg',img2:'https://images.unsplash.com/photo-1468327768560-75b778c5cbad?w=1200&q=80'}
];

let products = [];
let supabaseProductsLoaded = false;

async function loadProductsFromSupabase() {
  if (!supabaseClient) return null;
  try {
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('id', { ascending: true });
    if (error) throw error;
    if (data && data.length > 0) {
      // Map Supabase products to the format expected by the store
      supabaseProductsLoaded = true;
      return data.map(p => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        categoryLabel: p.category_label || 'General',
        category: p.category || 'general',
        desc: p.description || '',
        img: p.image || 'foto/asset/3.jpg',
        img2: p.image_2 || '',
      }));
    }
    // If table is empty, seed default products
    await seedDefaultProducts();
    return null;
  } catch (err) {
    console.error('Supabase fetch products failed:', err);
    return null;
  }
}

async function seedDefaultProducts() {
  if (!supabaseClient) return;
  try {
    const { count, error: countErr } = await supabaseClient
      .from('products')
      .select('*', { count: 'exact', head: true });
    if (countErr) throw countErr;
    if (count && count > 0) return; // Already seeded

    const rows = defaultProducts.map(p => ({
      name: p.name,
      price: p.price,
      category_label: p.categoryLabel,
      category: p.category,
      description: p.desc,
      image: p.img,
      image_2: p.img2 || '',
    }));

    const { error } = await supabaseClient.from('products').insert(rows);
    if (error) console.error('Seed products error:', error);
  } catch (err) {
    console.error('Seed products failed:', err);
  }
}

async function loadProducts() {
  // First try to load from Supabase
  if (supabaseClient && !supabaseProductsLoaded) {
    const supabaseProducts = await loadProductsFromSupabase();
    if (supabaseProducts) {
      products = supabaseProducts;
      localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products));
      if (typeof renderProducts === 'function') renderProducts();
      return;
    }
  }

  // Fall back to localStorage
  const saved = localStorage.getItem(STORAGE_PRODUCTS);
  if (saved) {
    try { products = JSON.parse(saved); } catch(e) { products = defaultProducts.slice(); }
  } else {
    products = defaultProducts.slice();
  }
  // Render setelah fallback juga
  if (typeof renderProducts === 'function') renderProducts();
}

function saveProducts() {
  localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products));
  try { if (PRODUCT_BC) PRODUCT_BC.postMessage({type: 'products-updated', timestamp: Date.now()}); } catch(e) {}
}

function loadOrders() {
  const saved = localStorage.getItem(STORAGE_ORDERS);
  return saved ? JSON.parse(saved) : [];
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
}

let cachedPaymentMethods = [];

async function loadPaymentMethods() {
  if (!supabaseClient) return [];
  try {
    const { data, error } = await supabaseClient
      .from('payment_methods')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    cachedPaymentMethods = data || [];
    return cachedPaymentMethods;
  } catch (err) {
    console.error('Gagal load payment methods:', err);
    return [];
  }
}

async function createOrder(order) {
  // Generate order number dulu — dipakai lokal DAN di Supabase
  const orderNumber = `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*9000+1000)}`;
  order.orderNumber = orderNumber; // simpan ke object order agar bisa ditampilkan ke customer

  const orders = loadOrders();
  orders.unshift(order);
  saveOrders(orders);
  localStorage.setItem('flower-shop-orders-sync', Date.now().toString());
  try { if (ORDER_BC) ORDER_BC.postMessage({type:'new-order', order}); } catch(e) {}

  if (!supabaseClient) return orderNumber;
  try {
    const { data: newOrder, error: oErr } = await supabaseClient
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: order.customerName || 'Guest',
        customer_email: order.customerEmail || null,
        customer_phone: order.customerPhone || null,
        customer_address: order.customerAddress || null,
        payment_method: order.paymentMethod || 'transfer',
        payment_method_id: order.paymentMethodId || null,
        notes: order.notes || null,
        total_amount: order.total,
        status: 'pending',
        payment_status: 'unpaid',
      })
      .select()
      .single();
    if (oErr) throw oErr;
    if (order.items && order.items.length) {
      const itemRows = order.items.map(i => ({
        order_id: newOrder.id,
        product_name: i.name,
        product_price: i.price,
        quantity: i.quantity,
        subtotal: i.price * i.quantity,
      }));
      const { error: iErr } = await supabaseClient.from('order_items').insert(itemRows);
      if (iErr) throw iErr;
    }
  } catch (err) {
    console.error('Supabase order insert failed:', err);
  }
  return orderNumber;
}

// Initialize — tunggu DOMContentLoaded dulu agar renderProducts pasti tersedia
const state = { cart: loadCart(), productFilter: 'all', searchQuery: '' };

function loadCart() {
  try {
    const saved = localStorage.getItem('flower-shop-cart');
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
}

function saveCart() {
  try { localStorage.setItem('flower-shop-cart', JSON.stringify(state.cart)); } catch {}
}

function initSearch() {
  const btn = document.getElementById('searchBtn');
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  const close = document.getElementById('searchClose');

  btn.addEventListener('click', () => {
    const isOpen = overlay.getAttribute('aria-hidden') === 'false';
    if (isOpen) { closeSearch(); return; }
    overlay.setAttribute('aria-hidden', 'false');
    setTimeout(() => input.focus(), 100);
  });

  close.addEventListener('click', closeSearch);

  input.addEventListener('input', () => {
    state.searchQuery = input.value.trim().toLowerCase();
    renderProducts();
    const results = products.filter(p =>
      p.name.toLowerCase().includes(state.searchQuery)
    );
    document.getElementById('searchResults').textContent =
      state.searchQuery ? `${results.length} produk ditemukan` : '';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.getAttribute('aria-hidden') === 'false') closeSearch();
    if (e.key === 'Enter' && overlay.getAttribute('aria-hidden') === 'false') closeSearch();
  });

  function closeSearch() {
    overlay.setAttribute('aria-hidden', 'true');
    state.searchQuery = '';
    input.value = '';
    renderProducts();
    document.getElementById('searchResults').textContent = '';
    window.scrollTo(0, 0);
  }
}

function formatIDR(n) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(n); }

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  updateCartCount();
  // Tampilkan produk default dulu, baru load dari Supabase
  products = defaultProducts.slice();
  renderProducts();
  // Load dari Supabase/localStorage di background
  loadProducts();
  initProductFilters();
  initSearch();
  initMobileNav();
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('cartBtn').addEventListener('click', toggleCartModal);
  document.getElementById('contactForm').addEventListener('submit', handleContact);
  document.getElementById('trackBtn').addEventListener('click', trackOrder);
  document.getElementById('trackInput').addEventListener('keydown', e => { if (e.key === 'Enter') trackOrder(); });
  initMarquee();
});

function initMobileNav() {
  const btn = document.getElementById('menuBtn');
  const nav = document.getElementById('mobileNav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const isOpen = nav.getAttribute('aria-hidden') === 'false';
    nav.setAttribute('aria-hidden', String(isOpen));
    btn.setAttribute('aria-expanded', String(!isOpen));
    btn.textContent = isOpen ? '☰' : '✕';
  });
}

function closeMobileNav() {
  const nav = document.getElementById('mobileNav');
  const btn = document.getElementById('menuBtn');
  if (nav) nav.setAttribute('aria-hidden', 'true');
  if (btn) { btn.setAttribute('aria-expanded', 'false'); btn.textContent = '☰'; }
}

// Listen for Supabase realtime product changes
if (supabaseClient) {
  supabaseClient
    .channel('web-products-realtime')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      async () => {
        supabaseProductsLoaded = false;
        await loadProducts();
        if (typeof renderProducts === 'function') renderProducts();
      }
    )
    .subscribe();
}

// Listen for BroadcastChannel messages (from admin dashboard in same browser)
try {
  if (typeof BroadcastChannel !== 'undefined') {
    const bc = new BroadcastChannel('flower-shop-products');
    bc.onmessage = async () => {
      supabaseProductsLoaded = false;
      await loadProducts();
      if (typeof renderProducts === 'function') renderProducts();
    };
  }
} catch(e) {}

// Listen for localStorage changes from other tabs
window.addEventListener('storage', event => {
  if (event.key === STORAGE_PRODUCTS) {
    products.splice(0, products.length, ...loadProducts());
    if (typeof renderProducts === 'function') renderProducts();
  }
});

// Duplicate marquee track content so the animation can scroll half-width (-50%) and loop seamlessly
function initMarquee() {
  const tracks = document.querySelectorAll('.hero-marquee__track');
  tracks.forEach(track => {
    if (track.dataset.looped) return;
    const children = Array.from(track.children);
    children.forEach(node => track.appendChild(node.cloneNode(true)));
    track.dataset.looped = '1';
  });
}

function renderProducts() {
  const grid = document.getElementById('productGrid');
  const scrollY = window.scrollY;
  grid.innerHTML = '';

  const filtered = products.filter(p => {
    if (state.productFilter !== 'all' && p.category !== state.productFilter) return false;
    if (state.searchQuery) return p.name.toLowerCase().includes(state.searchQuery);
    return true;
  });

  filtered.forEach(p => {
    // ── Container luar ──
    const card = document.createElement('article');
    card.className = 'card';

    // ── Inner (yang berputar) ──
    const inner = document.createElement('div');
    inner.className = 'card__inner';

    // ════ DEPAN ════
    const front = document.createElement('div');
    front.className = 'card__front';

    const img = document.createElement('img');
    img.src = p.img; img.alt = p.name; img.loading = 'lazy';

    const badge = document.createElement('span');
    badge.className = 'product-badge';
    badge.textContent = p.categoryLabel;

    const priceBadge = document.createElement('span');
    priceBadge.className = 'price-badge';
    priceBadge.textContent = formatIDR(p.price);

    const title = document.createElement('h2');
    title.className = 'title';
    title.textContent = p.name;

    const sub = document.createElement('p');
    sub.className = 'character-name';
    sub.textContent = p.categoryLabel;

    front.appendChild(img);
    front.appendChild(badge);
    front.appendChild(priceBadge);
    front.appendChild(title);
    front.appendChild(sub);

    // ════ BELAKANG ════
    const back = document.createElement('div');
    back.className = 'card__back';

    // Foto kedua — jika ada pakai img2, jika tidak placeholder emoji bunga
    if (p.img2) {
      const img2 = document.createElement('img');
      img2.src = p.img2;
      img2.alt = p.name + ' — detail';
      img2.className = 'card__back-img';
      img2.loading = 'lazy';
      back.appendChild(img2);
    } else {
      const ph = document.createElement('div');
      ph.className = 'card__back-img-placeholder';
      ph.textContent = '🌸';
      back.appendChild(ph);
    }

    // Body info
    const body = document.createElement('div');
    body.className = 'card__back-body';

    const bName = document.createElement('p');
    bName.className = 'card__back-name';
    bName.textContent = p.name;

    const bDesc = document.createElement('p');
    bDesc.className = 'card__back-desc';
    bDesc.textContent = p.desc;

    const bPrice = document.createElement('p');
    bPrice.className = 'card__back-price';
    bPrice.textContent = formatIDR(p.price);

    const actions = document.createElement('div');
    actions.className = 'card__back-actions';

    const addBtn = document.createElement('button');
    addBtn.className = 'btn btn-ghost';
    addBtn.textContent = '🛒 Keranjang';
    addBtn.addEventListener('click', e => { e.stopPropagation(); addToCart(p.id); });

    const buyBtn = document.createElement('button');
    buyBtn.className = 'btn btn-primary';
    buyBtn.textContent = '💐 Pesan';
    buyBtn.addEventListener('click', e => { e.stopPropagation(); openProductModal(p); });

    actions.appendChild(addBtn);
    actions.appendChild(buyBtn);

    body.appendChild(bName);
    body.appendChild(bDesc);
    body.appendChild(bPrice);
    body.appendChild(actions);
    back.appendChild(body);

    // ── Rakit ──
    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);
    grid.appendChild(card);
  });

  window.scrollTo(0, scrollY);
}

function openProductModal(p) {
  const content = document.getElementById('modalContent');
  content.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:1.25rem">
      <div style="position:relative;width:100%;height:260px;border-radius:18px;overflow:hidden;background-image:url(${encodeURI(p.img)});background-size:cover;background-position:center">
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(61,35,20,.6))"></div>
        <span style="position:absolute;top:.85rem;left:.85rem;background:rgba(255,255,255,.9);color:#c94d64;font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:.35rem .85rem;border-radius:50px;border:1px solid #f9a8b8">${escHtml(p.categoryLabel)}</span>
        <span style="position:absolute;top:.85rem;right:.85rem;background:#e8637a;color:#fff;font-size:.78rem;font-weight:700;padding:.35rem .85rem;border-radius:50px;box-shadow:0 4px 12px rgba(232,99,122,.4)">${escHtml(formatIDR(p.price))}</span>
      </div>
      <div>
        <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.75rem;font-weight:600;color:#3d2314;margin:0 0 .5rem;line-height:1.1">${escHtml(p.name)}</h3>
        <p style="color:#a07060;font-size:.92rem;line-height:1.75;margin:0 0 1.25rem">${escHtml(p.desc)}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
          <button class="btn btn-ghost" id="modalAdd" style="padding:.8rem;font-size:.82rem">🛒 Keranjang</button>
          <button class="btn btn-primary" id="modalOrder" style="padding:.8rem;font-size:.82rem">💐 Pesan Sekarang</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('modal').setAttribute('aria-hidden', 'false');
  document.getElementById('modalAdd').addEventListener('click', () => { addToCart(p.id); closeModal(); });
  document.getElementById('modalOrder').addEventListener('click', () => { orderSingleProduct(p); });
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.add('modal--closing');
  setTimeout(() => {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('modal--closing');
  }, 300);
}

function initProductFilters() {
  const allButton = document.querySelector('.filter-btn[data-filter="all"]');
  const panelButtons = document.querySelectorAll('.filter-panel-btn');
  const filterToggle = document.getElementById('filterToggle');
  const filterPanel = document.getElementById('filterPanel');

  function setFilter(filter) {
    state.productFilter = filter;
    renderProducts();
    allButton.classList.toggle('active', filter === 'all');
    panelButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter));
    closeFilterPanel();
  }

  allButton.addEventListener('click', () => setFilter('all'));

  panelButtons.forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  });

  filterToggle.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = !filterPanel.classList.contains('open');
    filterPanel.classList.toggle('open', isOpen);
    filterToggle.classList.toggle('open', isOpen);
    filterPanel.setAttribute('aria-hidden', String(!isOpen));
    filterToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', e => {
    if (!filterPanel.contains(e.target) && e.target !== filterToggle) closeFilterPanel();
  });

  function closeFilterPanel() {
    filterPanel.classList.remove('open');
    filterToggle.classList.remove('open');
    filterPanel.setAttribute('aria-hidden', 'true');
    filterToggle.setAttribute('aria-expanded', 'false');
  }
}

function addToCart(productId) {
  state.cart[productId] = (state.cart[productId] || 0) + 1;
  updateCartCount();
  saveCart();
  showMiniToast('🛒 Produk ditambahkan ke keranjang');
}

function updateCartCount() {
  const count = Object.values(state.cart).reduce((s, v) => s + v, 0);
  document.getElementById('cartCount').textContent = count;
}

function toggleCartModal() {
  const modal = document.getElementById('modal');
  const isOpen = modal.getAttribute('aria-hidden') === 'false';
  if (isOpen) return closeModal();
  renderCartModal();
}

function renderCartModal() {
  const modal = document.getElementById('modal');
  const items = Object.keys(state.cart).map(id => {
    const p = products.find(x => x.id == id);
    return p ? { product: p, qty: state.cart[id] } : null;
  }).filter(Boolean);

  let total = 0;
  const html = items.length ? `
    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem">
        <h3 style="margin:0;font-family:'Cormorant Garamond',serif;font-size:1.5rem;color:var(--text)">🛍️ Keranjang Anda</h3>
        <span style="font-size:.78rem;color:var(--muted);background:var(--surface2);padding:.25rem .75rem;border-radius:50px">${escHtml(String(items.length))} item</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:.5rem">
        ${items.map(it => {
          total += it.product.price * it.qty;
          return `
          <div style="display:flex;align-items:center;gap:.85rem;padding:.85rem;border-radius:16px;background:var(--bg2);border:1.5px solid rgba(232,99,122,.08)">
            <div style="width:52px;height:52px;border-radius:12px;background:url(${encodeURI(it.product.img)}) center/cover;flex-shrink:0;border:1.5px solid rgba(232,99,122,.12)"></div>
            <div style="flex:1;min-width:0">
              <div style="font-weight:600;font-size:.88rem;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escHtml(it.product.name)}</div>
              <div style="font-size:.75rem;color:var(--accent);font-weight:600">${escHtml(formatIDR(it.product.price))}</div>
            </div>
            <div style="display:flex;align-items:center;gap:.4rem;flex-shrink:0">
              <button onclick="changeCartQty(${escHtml(String(it.product.id))}, -1)" style="width:28px;height:28px;border-radius:50%;border:1.5px solid rgba(232,99,122,.3);background:var(--surface);color:var(--accent);font-size:1rem;display:flex;align-items:center;justify-content:center;cursor:pointer;font-weight:700">−</button>
              <span style="font-size:.9rem;font-weight:700;color:var(--text);min-width:20px;text-align:center">${escHtml(String(it.qty))}</span>
              <button onclick="changeCartQty(${escHtml(String(it.product.id))}, 1)" style="width:28px;height:28px;border-radius:50%;border:1.5px solid rgba(232,99,122,.3);background:var(--surface);color:var(--accent);font-size:1rem;display:flex;align-items:center;justify-content:center;cursor:pointer;font-weight:700">+</button>
              <button onclick="removeFromCart(${escHtml(String(it.product.id))})" style="width:28px;height:28px;border-radius:50%;border:1.5px solid rgba(200,50,50,.2);background:transparent;color:#e05555;font-size:.75rem;display:flex;align-items:center;justify-content:center;cursor:pointer;margin-left:.15rem" title="Hapus">✕</button>
            </div>
          </div>`;
        }).join('')}
      </div>
      <div style="margin-top:1rem;display:flex;justify-content:space-between;align-items:center;padding:.85rem 0;border-top:1.5px solid rgba(232,99,122,.1)">
        <span style="font-size:.9rem;color:var(--muted)">Total</span>
        <span style="font-weight:700;color:var(--accent);font-size:1.3rem">${escHtml(formatIDR(total))}</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
        <button class="btn btn-ghost" onclick="closeModal()">Lanjut Belanja</button>
        <button class="btn btn-primary" id="checkoutBtn">Checkout 💐</button>
      </div>
    </div>
  ` : `
    <div style="text-align:center;padding:2.5rem 1rem">
      <div style="font-size:3.5rem;margin-bottom:1rem">🌸</div>
      <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;color:var(--text);margin:0 0 .5rem">Keranjang Kosong</h3>
      <p style="color:var(--muted);font-size:.88rem;margin:0 0 1.5rem">Tambahkan bunga favorit Anda</p>
      <button class="btn btn-primary" onclick="closeModal()">💐 Jelajahi Koleksi</button>
    </div>
  `;
  document.getElementById('modalContent').innerHTML = html;
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.remove('modal--closing');
  const cb = document.getElementById('checkoutBtn');
  if (cb) cb.addEventListener('click', checkoutCart);
}

function changeCartQty(productId, delta) {
  const current = state.cart[productId] || 0;
  const next = current + delta;
  if (next <= 0) {
    delete state.cart[productId];
  } else {
    state.cart[productId] = next;
  }
  updateCartCount();
  saveCart();
  renderCartModal(); // re-render modal langsung
}

function removeFromCart(productId) {
  delete state.cart[productId];
  updateCartCount();
  saveCart();
  renderCartModal();
}

function orderSingleProduct(p) {
  openCheckoutForm([{ productId: p.id, name: p.name, quantity: 1, price: p.price }]);
}

function checkoutCart() {
  const items = Object.entries(state.cart).map(([id, qty]) => {
    const product = products.find(p => p.id == id);
    return { productId: Number(id), name: product?.name || 'Produk', quantity: qty, price: product?.price || 0 };
  }).filter(Boolean);
  if (!items.length) { showMiniToast('Keranjang kosong. Tambah produk terlebih dahulu.'); return; }
  openCheckoutForm(items);
}

function openCheckoutForm(items) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const summaryRows = items.map(it => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:.5rem 0;border-bottom:1px solid rgba(232,99,122,.08)">
      <div style="display:flex;align-items:center;gap:.6rem">
        <span style="font-size:.9rem">💐</span>
        <span style="font-size:.85rem;color:var(--text)">${escHtml(it.name)} × ${escHtml(String(it.quantity))}</span>
      </div>
      <span style="font-size:.85rem;font-weight:600;color:var(--accent)">${escHtml(formatIDR(it.price * it.quantity))}</span>
    </div>`).join('');

  const pmMethods = cachedPaymentMethods.length
    ? cachedPaymentMethods.map((pm, i) => `
      <label class="pm-label" style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:14px;border:1.5px solid rgba(232,99,122,.15);background:var(--bg2);cursor:pointer;transition:all .2s">
        <input type="radio" name="payment_method" value="${pm.id}" data-name="${pm.name}" ${i === 0 ? 'checked' : ''} style="accent-color:var(--accent)">
        <div>
          <div style="font-weight:600;font-size:.88rem;color:var(--text)">${pm.name}</div>
          <div style="font-size:.72rem;color:var(--muted)">${pm.type === 'transfer' ? '🏦 Transfer Bank' : pm.type === 'ewallet' ? '📱 E-Wallet' : '🚚 Bayar di Tempat'}</div>
        </div>
      </label>`).join('')
    : '<p style="color:var(--muted);font-size:.85rem;padding:.5rem 0">Metode pembayaran tidak tersedia</p>';

  const inputStyle = `width:100%;padding:.85rem 1.1rem;border-radius:14px;border:1.5px solid rgba(232,99,122,.18);background:var(--surface);color:var(--text);font:inherit;outline:none;`;

  document.getElementById('modalContent').innerHTML = `
    <div style="margin-bottom:1.25rem">
      <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:600;color:var(--text);margin:0 0 .25rem">💐 Lengkapi Pesanan</h3>
      <p style="font-size:.82rem;color:var(--muted);margin:0">Isi data pengiriman dan pilih metode bayar</p>
    </div>

    <div style="background:var(--bg2);border:1.5px solid rgba(232,99,122,.12);border-radius:16px;padding:1rem;margin-bottom:1.25rem">
      <p style="font-size:.7rem;text-transform:uppercase;color:var(--accent);font-weight:700;margin:0 0 .65rem;letter-spacing:.12em">🧾 Ringkasan Pesanan</p>
      ${summaryRows}
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:.75rem;padding-top:.75rem">
        <strong style="color:var(--text)">Total</strong>
        <strong style="color:var(--accent);font-size:1.1rem">${formatIDR(total)}</strong>
      </div>
    </div>

    <p style="font-size:.7rem;text-transform:uppercase;color:var(--accent);font-weight:700;margin:0 0 .6rem;letter-spacing:.12em">💳 Metode Pembayaran</p>
    <div style="display:grid;gap:.5rem;margin-bottom:1.25rem">${pmMethods}</div>

    <p style="font-size:.7rem;text-transform:uppercase;color:var(--accent);font-weight:700;margin:0 0 .6rem;letter-spacing:.12em">📦 Data Pengiriman</p>
    <div style="display:grid;gap:.65rem">
      <input type="text" id="co-name" placeholder="Nama Lengkap *" required style="${inputStyle}">
      <input type="tel" id="co-phone" placeholder="No. WhatsApp *" required style="${inputStyle}">
      <input type="email" id="co-email" placeholder="Email (opsional)" style="${inputStyle}">
      <input type="text" id="co-address" placeholder="Alamat Pengiriman *" required style="${inputStyle}">
      <textarea id="co-notes" placeholder="Catatan pesanan (opsional)" rows="2" style="${inputStyle}resize:none;"></textarea>
    </div>
    <div id="co-error" style="display:none;color:#dc2626;font-size:.82rem;margin-top:.6rem;padding:.5rem .75rem;background:#fef2f2;border-radius:10px;border:1px solid #fecaca"></div>
    <button id="co-submit" class="btn btn-primary" style="width:100%;margin-top:1.1rem;font-size:.95rem">Kirim Pesanan 🌸</button>
    <p style="text-align:center;font-size:.72rem;color:var(--muted);margin:.65rem 0 0">🔒 Data Anda aman dan terlindungi</p>
  `;

  document.getElementById('modal').setAttribute('aria-hidden', 'false');

  document.getElementById('co-submit').addEventListener('click', async () => {
    const name = document.getElementById('co-name').value.trim();
    const phone = document.getElementById('co-phone').value.trim();
    const address = document.getElementById('co-address').value.trim();
    const errEl = document.getElementById('co-error');
    if (!name || !phone || !address) {
      errEl.textContent = '⚠️ Nama, No. WhatsApp, dan Alamat wajib diisi.';
      errEl.style.display = 'block';
      return;
    }
    errEl.style.display = 'none';

    const selectedPm = document.querySelector('input[name="payment_method"]:checked');
    const paymentMethodId = selectedPm ? Number(selectedPm.value) : null;
    const paymentMethodName = selectedPm ? selectedPm.dataset.name : 'transfer';

    const submitBtn = document.getElementById('co-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Memproses... 🌸';

    // Rate limiting — max 3 order per menit
    if (!rateLimit('checkout', 3, 60000)) {
      errEl.textContent = '⚠️ Terlalu banyak percobaan. Tunggu beberapa saat.';
      errEl.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Kirim Pesanan 🌸';
      return;
    }

    // Sanitasi semua input sebelum disimpan
    const sanName = sanitizeInput(name, 100);
    const sanPhone = sanitizeInput(phone, 20);
    const sanAddress = sanitizeInput(address, 300);
    const sanEmail = sanitizeInput(document.getElementById('co-email').value.trim(), 100);
    const sanNotes = sanitizeInput(document.getElementById('co-notes').value.trim(), 500);

    // Validasi tambahan
    if (sanName.length < 2) {
      errEl.textContent = '⚠️ Nama terlalu pendek.';
      errEl.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Kirim Pesanan 🌸';
      return;
    }
    if (sanEmail && !isValidEmail(sanEmail)) {
      errEl.textContent = '⚠️ Format email tidak valid.';
      errEl.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Kirim Pesanan 🌸';
      return;
    }

    const order = {
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'New', source: 'web', items, total,
      customerName: sanName, customerPhone: sanPhone,
      customerEmail: sanEmail || null,
      customerAddress: sanAddress,
      paymentMethod: paymentMethodName,
      paymentMethodId: paymentMethodId,
      notes: sanNotes || null,
    };
    await createOrder(order);
    state.cart = {};
    updateCartCount();
    saveCart(); // persist clear cart
    const selectedPmDetail = cachedPaymentMethods.find(pm => pm.id === paymentMethodId);
    showPaymentConfirmation(order, selectedPmDetail);
  });
}

function showPaymentConfirmation(order, pmDetail) {
  const orderNumber = order.orderNumber || order.id.replace('ord-', 'ORD-').toUpperCase();
  const totalFormatted = formatIDR(order.total);
  const isTransfer = pmDetail && pmDetail.type === 'transfer';
  const isEwallet = pmDetail && pmDetail.type === 'ewallet';
  const isCOD = pmDetail && pmDetail.type === 'cod';

  const boxStyle = `background:var(--bg2);border:1.5px solid rgba(232,99,122,.15);border-radius:16px;padding:1.1rem;margin-bottom:1rem;`;
  const labelStyle = `font-size:.7rem;text-transform:uppercase;color:var(--accent);font-weight:700;margin:0 0 .65rem;letter-spacing:.12em;`;
  const rowStyle = `display:flex;justify-content:space-between;align-items:center;font-size:.85rem;padding:.3rem 0;`;
  const mutedStyle = `color:var(--muted);`;
  const strongStyle = `font-weight:600;color:var(--text);`;

  let paymentInstructions = '';

  if (isTransfer) {
    paymentInstructions = `
      <div style="${boxStyle}">
        <p style="${labelStyle}">🏦 Instruksi Transfer</p>
        <div style="display:flex;flex-direction:column;gap:.4rem">
          <div style="${rowStyle}"><span style="${mutedStyle}">Bank</span><strong style="${strongStyle}">${pmDetail.provider || pmDetail.name}</strong></div>
          <div style="${rowStyle}"><span style="${mutedStyle}">No. Rekening</span>
            <div style="display:flex;align-items:center;gap:.5rem">
              <strong style="${strongStyle}">${pmDetail.account_number || '-'}</strong>
              <button onclick="navigator.clipboard.writeText('${pmDetail.account_number}');showMiniToast('✅ Nomor disalin!')" style="background:var(--surface2);border:1px solid rgba(232,99,122,.2);color:var(--accent);padding:.2rem .55rem;border-radius:8px;cursor:pointer;font-size:.7rem;font-weight:600">Salin</button>
            </div>
          </div>
          <div style="${rowStyle}"><span style="${mutedStyle}">Atas Nama</span><strong style="${strongStyle}">${pmDetail.account_name || 'Amora Craft House'}</strong></div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:.5rem;padding-top:.65rem;border-top:1.5px solid rgba(232,99,122,.1)">
            <span style="${mutedStyle}">Jumlah Transfer</span>
            <strong style="color:var(--accent);font-size:1.1rem;font-weight:700">${totalFormatted}</strong>
          </div>
        </div>
        <p style="font-size:.75rem;color:var(--muted);margin:.75rem 0 0;line-height:1.6;padding:.6rem .75rem;background:rgba(232,99,122,.06);border-radius:10px;border-left:3px solid var(--accent)">⚠️ Transfer sesuai nominal tepat. Kirim bukti transfer via WhatsApp untuk verifikasi cepat.</p>
      </div>`;

  } else if (isEwallet) {
    const provider = (pmDetail.provider || pmDetail.name || '').toLowerCase();
    const phoneNum = pmDetail.account_number || '';
    let payNowBtn = '';

    if (provider === 'gopay') {
      const gopayWaNum = phoneNum.startsWith('0') ? '62' + phoneNum.slice(1) : phoneNum;
      const gopayWaMsg = encodeURIComponent(`Halo Amora Craft House! 🌸\n\nSaya sudah transfer via GoPay:\n📋 No. Pesanan: ${orderNumber}\n👤 Nama: ${order.customerName}\n💰 Nominal: ${totalFormatted}\n📱 Tujuan GoPay: ${phoneNum}\n\nMohon konfirmasi. Terima kasih!`);
      payNowBtn = `
        <div style="margin-top:.85rem;background:rgba(0,174,214,.07);border:1.5px solid rgba(0,174,214,.2);border-radius:14px;padding:.85rem">
          <p style="font-size:.78rem;font-weight:700;margin:0 0 .5rem;color:#0095b8">📱 Cara Transfer GoPay:</p>
          <ol style="font-size:.78rem;color:var(--muted);margin:0;padding-left:1.2rem;line-height:2">
            <li>Buka app <strong style="color:var(--text)">GoPay</strong></li>
            <li>Pilih <strong style="color:var(--text)">Kirim Uang</strong></li>
            <li>Nomor tujuan: <strong style="color:#0095b8">${phoneNum}</strong>
              <button onclick="navigator.clipboard.writeText('${phoneNum}');showMiniToast('✅ Disalin!')" style="background:rgba(0,174,214,.15);border:none;color:#0095b8;padding:.15rem .5rem;border-radius:8px;cursor:pointer;font-size:.68rem;font-weight:600;margin-left:.35rem">Salin</button>
            </li>
            <li>Nominal: <strong style="color:var(--accent)">${totalFormatted}</strong></li>
          </ol>
        </div>
        <a href="https://wa.me/${gopayWaNum}?text=${gopayWaMsg}" target="_blank" class="btn btn-primary" style="display:flex;align-items:center;justify-content:center;gap:.5rem;text-decoration:none;margin-top:.75rem;background:linear-gradient(135deg,#25D366,#128C7E)">
          💬 Sudah Transfer? Kirim Bukti via WA
        </a>`;
    } else if (provider === 'dana') {
      payNowBtn = `
        <a href="dana://transfer?phone=${phoneNum}&amount=${order.total}" onclick="setTimeout(()=>window.location.href='https://dana.id',1500)" class="btn btn-primary" style="display:flex;align-items:center;justify-content:center;gap:.5rem;text-decoration:none;margin-top:.85rem;background:linear-gradient(135deg,#118EEA,#0D6BB0)">
          💙 Buka Aplikasi DANA
        </a>
        <p style="font-size:.72rem;color:var(--muted);margin:.4rem 0 0;text-align:center">Transfer ke <strong>${phoneNum}</strong> sejumlah <strong>${totalFormatted}</strong></p>`;
    } else if (provider === 'ovo') {
      payNowBtn = `
        <a href="ovo://transfer?phone=${phoneNum}&amount=${order.total}" onclick="setTimeout(()=>window.location.href='https://ovo.id',1500)" class="btn btn-primary" style="display:flex;align-items:center;justify-content:center;gap:.5rem;text-decoration:none;margin-top:.85rem;background:linear-gradient(135deg,#4C3494,#7B5EA7)">
          💜 Buka Aplikasi OVO
        </a>
        <p style="font-size:.72rem;color:var(--muted);margin:.4rem 0 0;text-align:center">Transfer ke <strong>${phoneNum}</strong> sejumlah <strong>${totalFormatted}</strong></p>`;
    } else {
      payNowBtn = `<p style="font-size:.78rem;color:var(--muted);margin:.65rem 0 0;line-height:1.6">Transfer ke <strong>${phoneNum}</strong> sejumlah <strong>${totalFormatted}</strong>. Kirim bukti via WhatsApp.</p>`;
    }

    paymentInstructions = `
      <div style="${boxStyle}">
        <p style="${labelStyle}">📱 Bayar via ${pmDetail.name}</p>
        <div style="display:flex;flex-direction:column;gap:.4rem">
          <div style="${rowStyle}"><span style="${mutedStyle}">Platform</span><strong style="${strongStyle}">${pmDetail.provider || pmDetail.name}</strong></div>
          <div style="${rowStyle}"><span style="${mutedStyle}">No. Tujuan</span>
            <div style="display:flex;align-items:center;gap:.5rem">
              <strong style="${strongStyle}">${phoneNum}</strong>
              <button onclick="navigator.clipboard.writeText('${phoneNum}');showMiniToast('✅ Disalin!')" style="background:var(--surface2);border:1px solid rgba(232,99,122,.2);color:var(--accent);padding:.2rem .55rem;border-radius:8px;cursor:pointer;font-size:.7rem;font-weight:600">Salin</button>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:.5rem;padding-top:.65rem;border-top:1.5px solid rgba(232,99,122,.1)">
            <span style="${mutedStyle}">Jumlah Transfer</span>
            <strong style="color:var(--accent);font-size:1.1rem;font-weight:700">${totalFormatted}</strong>
          </div>
        </div>
        ${payNowBtn}
      </div>`;

  } else if (isCOD) {
    paymentInstructions = `
      <div style="${boxStyle}">
        <p style="${labelStyle}">🚚 Bayar di Tempat (COD)</p>
        <p style="font-size:.9rem;line-height:1.7;margin:0;color:var(--text)">Siapkan uang tunai sebesar <strong style="color:var(--accent)">${escHtml(totalFormatted)}</strong> saat pesanan tiba. Kurir kami akan menghubungi Anda sebelum pengiriman.</p>
      </div>`;
  } else {
    paymentInstructions = `
      <div style="${boxStyle}">
        <p style="font-size:.9rem;line-height:1.7;margin:0;color:var(--text)">Tim kami akan menghubungi <strong>${escHtml(order.customerPhone)}</strong> untuk detail pembayaran sebesar <strong style="color:var(--accent)">${escHtml(totalFormatted)}</strong>.</p>
      </div>`;
  }

  // Nomor WA admin
  const ewalletMethod = cachedPaymentMethods.find(pm => pm.type === 'ewallet' && pm.account_number);
  const rawWaNum = (ewalletMethod?.account_number || '083829092027').replace(/\D/g, '');
  const adminWa = rawWaNum.startsWith('0') ? '62' + rawWaNum.slice(1) : rawWaNum;
  // Sanitasi data sebelum masuk ke URL WhatsApp
  const waMessage = encodeURIComponent(
    `Halo Amora Craft House! 🌸\n\nKonfirmasi pesanan:\n📋 ${sanitizeInput(orderNumber,30)}\n👤 ${sanitizeInput(order.customerName,100)}\n💰 ${sanitizeInput(totalFormatted,30)}\n💳 ${sanitizeInput(order.paymentMethod,50)}\n📍 ${sanitizeInput(order.customerAddress,200)}\n\nMohon konfirmasinya, terima kasih!`
  );

  document.getElementById('modalContent').innerHTML = `
    <div style="text-align:center;margin-bottom:1.25rem">
      <div style="width:64px;height:64px;background:linear-gradient(135deg,var(--accent),var(--accent3));border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto .75rem;font-size:1.75rem;box-shadow:0 8px 24px rgba(232,99,122,.35)">✅</div>
      <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:600;color:var(--text);margin:0 0 .25rem">Pesanan Berhasil!</h3>
      <p style="color:var(--muted);font-size:.84rem;margin:0">Selesaikan pembayaran untuk memproses pesanan Anda</p>
    </div>
    <div style="${boxStyle}">
      <p style="${labelStyle}">🧾 Detail Pesanan</p>
      <div style="${rowStyle}"><span style="${mutedStyle}">No. Pesanan</span><strong style="font-family:monospace;color:var(--accent)">${escHtml(orderNumber)}</strong></div>
      <div style="${rowStyle}"><span style="${mutedStyle}">Nama</span><strong style="${strongStyle}">${escHtml(order.customerName)}</strong></div>
      <div style="${rowStyle}"><span style="${mutedStyle}">Total</span><strong style="color:var(--accent);font-size:1rem">${escHtml(totalFormatted)}</strong></div>
      <div style="${rowStyle}"><span style="${mutedStyle}">Metode</span><strong style="${strongStyle}">${escHtml(order.paymentMethod)}</strong></div>
    </div>
    ${paymentInstructions}
    <div style="display:grid;gap:.6rem">
      <a href="https://wa.me/${escHtml(adminWa)}?text=${waMessage}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display:flex;align-items:center;justify-content:center;gap:.5rem;text-decoration:none">
        💬 Konfirmasi via WhatsApp
      </a>
      <button class="btn btn-ghost" onclick="closeModal()">Selesai</button>
    </div>
    <p style="text-align:center;font-size:.72rem;color:var(--muted);margin:.6rem 0 0">Admin akan memverifikasi pembayaran dalam 1×24 jam 🌸</p>
  `;
  document.getElementById('modal').setAttribute('aria-hidden', 'false');
}

// Load payment methods on init
loadPaymentMethods();

function handleContact(e) {
  e.preventDefault();
  const f = e.target;
  const name = f.name.value.trim();
  const email = f.email.value.trim();
  const message = f.message.value.trim();
  if (!name || !email || !message) { showMiniToast('⚠️ Lengkapi semua kolom'); return; }

  // Kirim langsung ke WhatsApp admin
  const waNum = '6283829092027';
  const waMsg = encodeURIComponent(
    `Halo Amora Craft House! 🌸\n\nPesan dari website:\n👤 Nama: ${name}\n📧 Email: ${email}\n💬 Pesan:\n${message}`
  );
  window.open(`https://wa.me/${waNum}?text=${waMsg}`, '_blank');
  showMiniToast('✅ Membuka WhatsApp...');
  f.reset();
}

function showMiniToast(text) {
  const el = document.createElement('div');
  el.className = 'mini-toast';
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.style.opacity = '0', 2200);
  setTimeout(() => el.remove(), 2700);
}
