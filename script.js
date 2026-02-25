// --- Database: Premium A to Z Catalog (Real Images & Stock) ---
let products = [
    { id: 1, name: "Monstera Deliciosa", category: "Indoor", price: 499, stock: 10, img: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&q=80", tags: ["Air Purifying"], sun: "☀️ Medium", water: "💧 Weekly" },
    { id: 2, name: "Snake Plant", category: "Indoor", price: 299, stock: 5, img: "https://images.unsplash.com/photo-1593691509543-c55fb32e7355?w=500&q=80", tags: ["Low Maintenance"], sun: "☀️ Low", water: "💧 Bi-Weekly" },
    { id: 3, name: "Ficus Bonsai", category: "Indoor", price: 899, stock: 2, img: "https://images.unsplash.com/photo-1599598425947-3300262939fb?w=500&q=80", tags: ["Bonsai"], sun: "☀️ Bright", water: "💧 Frequent" },
    
    { id: 4, name: "Aloe Vera", category: "Outdoor", price: 199, stock: 20, img: "https://images.unsplash.com/photo-1554631221-1f633514ac12?w=500&q=80", tags: ["Medicinal"], sun: "☀️ Direct", water: "💧 Bi-Weekly" },
    { id: 5, name: "Areca Palm", category: "Outdoor", price: 699, stock: 0, img: "https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?w=500&q=80", tags: ["Big Size"], sun: "☀️ Indirect", water: "💧 Weekly" },
    
    { id: 6, name: "Red Rose Plant", category: "Flowers", price: 349, stock: 15, img: "https://images.unsplash.com/photo-1565011523534-747a8601f10a?w=500&q=80", tags: ["Romantic"], sun: "☀️ Full Sun", water: "💧 Daily" },
    { id: 7, name: "Sunflower Pot", category: "Flowers", price: 250, stock: 8, img: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=500&q=80", tags: ["Bright"], sun: "☀️ Full Sun", water: "💧 Daily" },
    
    { id: 8, name: "Mixed Flower Seeds", category: "Seeds", price: 150, stock: 50, img: "https://images.unsplash.com/photo-1587293852726-70cdb56c2836?w=500&q=80", tags: ["Pack of 5"], sun: "☀️ Medium", water: "💧 Keep moist" },
    { id: 9, name: "Organic Basil Seeds", category: "Seeds", price: 99, stock: 30, img: "https://images.unsplash.com/photo-1628156327344-9669527ec3d9?w=500&q=80", tags: ["Herbs"], sun: "☀️ Full Sun", water: "💧 Daily" },
    
    { id: 10, name: "Premium Ceramic Pot", category: "Accessories", price: 399, stock: 12, img: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500&q=80", tags: ["Decor"], sun: "N/A", water: "N/A" },
    { id: 11, name: "Terracotta Pots (Set)", category: "Accessories", price: 299, stock: 25, img: "https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?w=500&q=80", tags: ["Classic"], sun: "N/A", water: "N/A" },
    { id: 12, name: "Gardening Tool Kit", category: "Accessories", price: 549, stock: 5, img: "https://images.unsplash.com/photo-1416879598555-46e551e9b0d2?w=500&q=80", tags: ["Steel"], sun: "N/A", water: "N/A" }
];

// --- Global Variables ---
let cart = [];
let myOrders = [];
let wishlist = [];
let totalRevenue = 0;
let discountApplied = false;

// --- Initialization & Setup ---
window.onload = () => {
    gsap.from(".glass-box", { y: -50, opacity: 0, duration: 0.8, ease: "back.out" });
    renderProducts('All');
    renderAdminProducts(); // Ensure admin inventory is populated
};

function toggleTheme() {
    const body = document.body;
    body.getAttribute('data-theme') === 'dark' ? body.removeAttribute('data-theme') : body.setAttribute('data-theme', 'dark');
}

// --- Login System ---
function sendOTP() {
    const mobile = document.getElementById("mobileInput").value;
    if(mobile.length === 10) {
        document.getElementById("loginStep1").style.display = "none";
        document.getElementById("loginStep2").style.display = "block";
    } else { alert("Boss, please enter a valid 10-digit number."); }
}

function verifyOTP() {
    gsap.to("#loginOverlay", { opacity: 0, duration: 0.5, onComplete: () => {
        document.getElementById("loginOverlay").style.display = "none";
        document.getElementById("mainHeader").style.display = "flex";
        document.getElementById("mainContentWrapper").style.display = "block";
    }});
}

function adminLogin() {
    const id = prompt("Admin ID:"); const pass = prompt("Admin Password:");
    if(id === "Vivekshukla" && pass === "Vivek1234@") {
        document.getElementById("loginOverlay").style.display = "none";
        document.getElementById("mainHeader").style.display = "none";
        document.getElementById("mainContentWrapper").style.display = "none";
        document.getElementById("adminSection").style.display = "flex";
        updateAdminStats();
    } else { alert("Access Denied!"); }
}

function logout() { location.reload(); }
function logoutAdmin() { location.reload(); }

function showSection(sectionId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.style.display = 'none');
    const target = document.getElementById(sectionId);
    target.style.display = 'flex';
    gsap.from(target, { opacity: 0, y: 20, duration: 0.5 });
    if(sectionId === 'wishlistSection') renderWishlist();
}

// --- Shop, Wishlist & Rendering Logic ---
function renderProducts(filter, searchQuery = "") {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";
    
    products.forEach(p => {
        let matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        let matchFilter = (filter === 'All' || p.category === filter || p.tags.includes(filter));
        
        if(matchFilter && matchSearch) {
            let stockStatus = p.stock > 0 ? 
                `<button class="btn-primary" onclick="event.stopPropagation(); addToCart(${p.id})">Add to Cart</button>` : 
                `<button class="btn-primary" disabled>Out of Stock</button>`;
            
            let wishClass = wishlist.includes(p.id) ? 'active' : '';
            
            grid.innerHTML += `
                <div class="product-card" onclick="openProductModal(${p.id})">
                    <i class="fa-solid fa-heart wish-icon ${wishClass}" onclick="event.stopPropagation(); toggleWishlist(${p.id})"></i>
                    <img src="${p.img}" alt="${p.name}">
                    <h3>${p.name}</h3>
                    <p style="font-weight: bold; color: var(--primary); margin: 10px 0; font-size: 18px;">₹${p.price}</p>
                    ${stockStatus}
                </div>
            `;
        }
    });
}

function filterPlants(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderProducts(category);
}

function searchProducts() {
    let query = document.getElementById("searchInput").value;
    renderProducts('All', query);
}

function toggleWishlist(id) {
    let index = wishlist.indexOf(id);
    if(index > -1) wishlist.splice(index, 1);
    else wishlist.push(id);
    document.getElementById("wishCount").innerText = wishlist.length;
    renderProducts('All', document.getElementById("searchInput").value);
    renderWishlist();
}

function renderWishlist() {
    const grid = document.getElementById("wishlistGrid");
    grid.innerHTML = "";
    if(wishlist.length === 0) {
        grid.innerHTML = "<p>Your wishlist is empty. Explore our catalog! ❤️</p>";
        return;
    }
    products.forEach(p => {
        if(wishlist.includes(p.id)) {
            grid.innerHTML += `
                <div class="product-card">
                    <i class="fa-solid fa-heart wish-icon active" onclick="toggleWishlist(${p.id})"></i>
                    <img src="${p.img}"><h3>${p.name}</h3><p style="font-weight: bold; color: var(--primary); margin: 10px 0;">₹${p.price}</p>
                    <button class="btn-primary" onclick="addToCart(${p.id}); toggleWishlist(${p.id})">Move to Cart</button>
                </div>`;
        }
    });
}

// --- Product Quick View Modal ---
function openProductModal(id) {
    const p = products.find(x => x.id === id);
    if(p) {
        document.getElementById("detailImg").src = p.img;
        document.getElementById("detailTitle").innerText = p.name;
        document.getElementById("detailPrice").innerText = "₹" + p.price;
        document.getElementById("detailStock").innerText = p.stock > 0 ? `In Stock: ${p.stock}` : "Out of Stock";
        document.getElementById("detailSun").innerText = p.sun;
        document.getElementById("detailWater").innerText = p.water;
        
        let btn = document.getElementById("detailAddToCartBtn");
        if(p.stock > 0) {
            btn.innerText = "Add to Cart"; btn.disabled = false;
            btn.onclick = () => { addToCart(p.id); closeProductModal(); };
        } else {
            btn.innerText = "Out of Stock"; btn.disabled = true;
        }

        const overlay = document.getElementById("productOverlay");
        overlay.style.display = "flex";
        gsap.to(overlay, { opacity: 1, duration: 0.3 });
    }
}
function closeProductModal() { gsap.to("#productOverlay", { opacity: 0, duration: 0.3, onComplete: () => { document.getElementById("productOverlay").style.display = "none"; }}); }

// --- Cart & Stock Management System ---
function addToCart(id) {
    const p = products.find(x => x.id === id);
    if(p && p.stock > 0) {
        cart.push(p);
        p.stock--; // Local Deduct
        document.getElementById("cartCount").innerText = cart.length;
        gsap.from(".cart-btn", { scale: 1.3, duration: 0.3, ease: "bounce.out" });
        renderProducts('All', document.getElementById("searchInput").value); // Refresh UI
    }
}

function openCart() {
    const overlay = document.getElementById("cartOverlay");
    overlay.style.display = "flex"; gsap.to(overlay, { opacity: 1, duration: 0.3 });
    updateCartUI();
}

function updateCartUI() {
    const list = document.getElementById("cartItemsList");
    let total = 0; list.innerHTML = "";
    
    if(cart.length === 0) { list.innerHTML = "<p>Your cart is empty!</p>"; } 
    else {
        cart.forEach((item, index) => {
            total += item.price;
            list.innerHTML += `<div style="display:flex; justify-content:space-between; padding:10px; background:var(--card-bg); margin-bottom:5px; border-radius:5px; border:1px solid var(--border);"><span>${item.name}</span><span>₹${item.price} <i class="fa-solid fa-trash" style="color:red; cursor:pointer; margin-left:10px;" onclick="removeItem(${index}, ${item.id})"></i></span></div>`;
        });
    }
    
    let finalTotal = total > 0 ? total + 50 : 0;
    if(discountApplied && finalTotal > 50) {
        finalTotal -= 50;
        document.getElementById("discountText").style.display = "block";
    }
    document.getElementById("cartTotal").innerText = finalTotal;
}

function closeCart() { gsap.to("#cartOverlay", { opacity: 0, duration: 0.3, onComplete: () => { document.getElementById("cartOverlay").style.display = "none"; }}); }
function removeItem(index, pId) { 
    cart.splice(index, 1); 
    products.find(x => x.id === pId).stock++; // Restore stock
    document.getElementById("cartCount").innerText = cart.length; 
    updateCartUI(); renderProducts('All', document.getElementById("searchInput").value);
}

function applyPromo() {
    let code = document.getElementById("promoCode").value;
    if(code.toUpperCase() === "VIVA50" && !discountApplied && cart.length > 0) {
        discountApplied = true;
        document.getElementById("promoMsg").style.display = "block";
        updateCartUI();
    } else {
        alert("Invalid promo code, or already applied, or cart is empty!");
    }
}

// --- Checkout Simulation & Full Sync ---
function startCheckout() {
    if(cart.length === 0) return alert("Add items to cart first!");
    closeCart();
    document.getElementById("paymentOverlay").style.display = "flex";
    gsap.to("#paymentOverlay", { opacity: 1, duration: 0.3 });
}

function processAutoPayment() {
    let address = document.getElementById("deliveryAddress").value;
    let date = document.getElementById("deliveryDate").value;
    if(!address || !date) return alert("Please fill Delivery Address and Date.");

    document.getElementById("paymentForm").style.display = "none";
    document.getElementById("payTitle").style.display = "none";
    document.getElementById("payLoader").style.display = "block";

    // Simulate 4 Second Server Delay
    setTimeout(() => {
        document.getElementById("payLoader").style.display = "none";
        document.getElementById("paySuccess").style.display = "block";
        confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 }, colors: ['#2d6a4f', '#40916c', '#b7e4c7'] });

        let cartTotalValue = parseInt(document.getElementById("cartTotal").innerText);
        let randomOrderId = Math.floor(Math.random() * 90000) + 10000;
        
        // 1. Add to Customer Order History
        myOrders.push({ id: randomOrderId, items: cart.length, total: cartTotalValue, status: 'Processing', date: date });
        totalRevenue += cartTotalValue;
        
        // 2. Add to Admin Live Table
        let adminTable = document.getElementById("adminOrderTable");
        let newAdminOrder = `
            <tr id="row-${randomOrderId}">
                <td style="font-weight: bold;">#ORD-${randomOrderId}</td>
                <td>Live Demo User</td>
                <td style="color: var(--primary); font-weight: bold;">₹${cartTotalValue}</td>
                <td>
                    <select onchange="changeOrderStatus(${randomOrderId}, this.value)" style="padding:5px; border-radius:5px; border:1px solid #ccc; background:white; color:black;">
                        <option value="Processing" selected>Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                </td>
            </tr>
        `;
        adminTable.innerHTML = newAdminOrder + adminTable.innerHTML;
        
        // 3. IMPORTANT BUG FIX: Sync deducted cart items to Admin Inventory UI permanently
        renderAdminProducts();
        updateAdminStats();

        // 4. Reset Customer Data
        cart = []; discountApplied = false; document.getElementById("cartCount").innerText = "0";
    }, 4000);
}

function closePayment() { gsap.to("#paymentOverlay", { opacity: 0, duration: 0.3, onComplete: () => { document.getElementById("paymentOverlay").style.display = "none"; }}); }
function closePaymentSuccess() { closePayment(); showMyOrders(); }

// --- My Orders Section ---
function showMyOrders() {
    showSection('ordersSection');
    const list = document.getElementById("myOrdersList");
    if(myOrders.length === 0) { list.innerHTML = "<p>Boss, you haven't placed any orders yet. 🌱</p>"; return; }
    
    let html = '<table class="admin-table"><tr><th>Order ID</th><th>Items</th><th>Amount</th><th>Expected Delivery</th><th>Live Status</th></tr>';
    myOrders.forEach(o => {
        html += `<tr><td style="font-weight:bold;">#ORD-${o.id}</td><td>${o.items} items</td><td style="color:var(--primary); font-weight:bold;">₹${o.total}</td><td>${o.date}</td><td><span class="status-badge" id="status-${o.id}">${o.status}</span></td></tr>`;
    });
    list.innerHTML = html + '</table>';
}

// --- ADVANCED ADMIN PANEL LOGIC (Bug Fixed) ---

// Bug Fix: 'element' pass kiya gaya taaki click errors na aayein
function switchAdminTab(tab, element) {
    document.getElementById("adminTabDashboard").style.display = tab === 'dashboard' ? 'block' : 'none';
    document.getElementById("adminTabInventory").style.display = tab === 'inventory' ? 'block' : 'none';
    
    // Remove active class safely
    document.querySelectorAll(".admin-sidebar a").forEach(a => a.classList.remove("active"));
    if(element) element.classList.add("active");
}

function updateAdminStats() {
    document.getElementById("adminActiveOrders").innerText = myOrders.length;
    document.getElementById("adminRev").innerText = "₹" + totalRevenue;
    document.getElementById("adminLowStock").innerText = products.filter(p => p.stock < 5).length;
}

// Live Status Control Sync
function changeOrderStatus(orderId, newStatus) {
    let order = myOrders.find(o => o.id === orderId);
    if(order) order.status = newStatus;
    
    // Reflect in customer UI live
    let custStatusSpan = document.getElementById(`status-${orderId}`);
    if(custStatusSpan) custStatusSpan.innerText = newStatus;
    
    alert(`Success: Order #ORD-${orderId} updated to ${newStatus}`);
}

function downloadCSV() {
    if(myOrders.length === 0) return alert("No sales data to export.");
    let csvContent = "data:text/csv;charset=utf-8,OrderID,Items,Amount,Date,Status\n";
    myOrders.forEach(o => { csvContent += `ORD-${o.id},${o.items},${o.total},${o.date},${o.status}\n`; });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "NavyaAstra_Sales_Report.csv");
    document.body.appendChild(link); link.click();
}

// Inventory & Stock Management (CRUD)
function renderAdminProducts() {
    let table = document.getElementById("adminProductsTable");
    table.innerHTML = "";
    products.forEach((p, index) => {
        table.innerHTML += `
            <tr>
                <td><img src="${p.img}" style="width:50px; height:50px; border-radius:5px; object-fit:cover;"></td>
                <td>${p.name}</td>
                <td>₹${p.price}</td>
                <td><input type="number" value="${p.stock}" onchange="updateStock(${p.id}, this.value)" style="width:60px; padding:5px; border-radius:5px; border:1px solid var(--border); background:var(--bg-color); color:var(--text-color);"></td>
                <td><button onclick="deleteProduct(${index})" style="background:#ff4d4d; color:white; border:none; padding:8px 12px; border-radius:5px; cursor:pointer;">Delete</button></td>
            </tr>`;
    });
    updateAdminStats();
}

function addNewProduct() {
    let name = document.getElementById("newPName").value;
    let price = document.getElementById("newPPrice").value;
    let stock = document.getElementById("newPStock").value;
    if(name && price && stock) {
        products.push({
            id: Date.now(), name: name, category: "Indoor", price: parseInt(price), stock: parseInt(stock),
            img: "https://images.unsplash.com/photo-1466692476877-6dbf263bf156?w=500&q=80", tags: ["New Arrival"], sun:"☀️ Medium", water:"💧 Weekly"
        });
        renderAdminProducts(); renderProducts('All'); alert("Product Added Successfully!");
    } else alert("Please fill all fields to add a new product.");
}

function updateStock(id, newStock) {
    let p = products.find(x => x.id === id);
    if(p) p.stock = parseInt(newStock);
    renderProducts('All', document.getElementById("searchInput").value); 
    updateAdminStats();
}

function deleteProduct(index) {
    if(confirm("Boss, are you sure you want to delete this product?")) {
        products.splice(index, 1);
        renderAdminProducts(); renderProducts('All');
    }
}

// --- Three.js 3D Background System ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const geometry = new THREE.IcosahedronGeometry(2, 0);
const material = new THREE.MeshStandardMaterial({ color: 0x40916c, wireframe: true });
const shape1 = new THREE.Mesh(geometry, material); shape1.position.set(-6, 2, -5); scene.add(shape1);
const shape2 = new THREE.Mesh(geometry, material); shape2.position.set(6, -2, -8); scene.add(shape2);

const light = new THREE.DirectionalLight(0xffffff, 1); light.position.set(5, 5, 5); scene.add(light);
camera.position.z = 5;

function animate3D() {
    requestAnimationFrame(animate3D);
    shape1.rotation.x += 0.002; shape1.rotation.y += 0.003;
    shape2.rotation.x -= 0.001; shape2.rotation.y += 0.004;
    renderer.render(scene, camera);
}
animate3D();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
