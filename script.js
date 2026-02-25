// --- Simulated Database (Products) ---
const products = [
    { id: 1, name: "Monstera Deliciosa", category: "Indoor", price: 499, img: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=400&q=80", tags: ["Low Light", "Air Purifying"] },
    { id: 2, name: "Snake Plant", category: "Indoor", price: 299, img: "https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=400&q=80", tags: ["Low Light", "Pet-Friendly"] },
    { id: 3, name: "Areca Palm", category: "Outdoor", price: 699, img: "https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?auto=format&fit=crop&w=400&q=80", tags: ["High Sunlight"] },
    { id: 4, name: "Spider Plant", category: "Pet-Friendly", price: 199, img: "https://images.unsplash.com/photo-1610808386121-65576aee4f90?auto=format&fit=crop&w=400&q=80", tags: ["Pet-Friendly", "Air Purifying"] }
];

let cart = [];

// --- Login & Admin Logic ---
window.onload = () => {
    gsap.from(".glass-box", { y: -50, opacity: 0, duration: 0.8, ease: "back.out(1.7)" });
    renderProducts('All');
};

function sendOTP() {
    const mobile = document.getElementById("mobileInput").value;
    if(mobile.length === 10) {
        document.getElementById("loginStep1").style.display = "none";
        document.getElementById("loginStep2").style.display = "block";
    } else {
        alert("Boss, please enter a valid 10-digit number.");
    }
}

function verifyOTP() {
    gsap.to("#loginOverlay", { opacity: 0, duration: 0.5, onComplete: () => {
        document.getElementById("loginOverlay").style.display = "none";
        document.getElementById("mainHeader").style.display = "flex";
        showSection('homeSection');
    }});
}

function adminLogin() {
    const id = prompt("Admin ID:");
    const pass = prompt("Admin Password:");
    if(id === "Vivekshukla" && pass === "Vivek1234@") {
        document.getElementById("loginOverlay").style.display = "none";
        document.getElementById("adminSection").style.display = "flex";
    } else {
        alert("Access Denied!");
    }
}

function logout() { location.reload(); }
function logoutAdmin() { location.reload(); }

// --- Navigation Logic ---
function showSection(sectionId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.style.display = 'none');
    const target = document.getElementById(sectionId);
    target.style.display = 'flex';
    gsap.from(target, { opacity: 0, y: 20, duration: 0.5 });
}

// --- Shop & Cart Logic ---
function renderProducts(filter) {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";
    products.forEach(p => {
        if(filter === 'All' || p.category === filter || p.tags.includes(filter)) {
            let tagsHTML = p.tags.map(t => `<span class="tag">${t}</span>`).join("");
            grid.innerHTML += `
                <div class="product-card">
                    <img src="${p.img}" alt="${p.name}">
                    <h3>${p.name}</h3>
                    <div style="margin: 10px 0;">${tagsHTML}</div>
                    <p style="font-weight: bold; color: #2d6a4f; margin-bottom: 10px;">₹${p.price}</p>
                    <button class="btn-primary" onclick="addToCart(${p.id}, '${p.name}', ${p.price})">Add to Cart</button>
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

function addToCart(id, name, price) {
    cart.push({id, name, price});
    document.getElementById("cartCount").innerText = cart.length;
    gsap.from(".cart-btn", { scale: 1.3, duration: 0.3, ease: "bounce.out" });
}

// --- Cart & Checkout Overlays ---
function openCart() {
    const overlay = document.getElementById("cartOverlay");
    overlay.style.display = "flex";
    gsap.to(overlay, { opacity: 1, duration: 0.3 });
    
    const list = document.getElementById("cartItemsList");
    let total = 0;
    list.innerHTML = "";
    
    if(cart.length === 0) {
        list.innerHTML = "<p>Your cart is empty!</p>";
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            list.innerHTML += `
                <div class="cart-item">
                    <span>${item.name}</span>
                    <span>₹${item.price} <i class="fa-solid fa-trash" style="color:red; cursor:pointer; margin-left:10px;" onclick="removeItem(${index})"></i></span>
                </div>
            `;
        });
    }
    document.getElementById("cartTotal").innerText = total > 0 ? total + 50 : 0;
}

function closeCart() {
    gsap.to("#cartOverlay", { opacity: 0, duration: 0.3, onComplete: () => {
        document.getElementById("cartOverlay").style.display = "none";
    }});
}

function removeItem(index) {
    cart.splice(index, 1);
    document.getElementById("cartCount").innerText = cart.length;
    openCart(); // Refresh cart UI
}

// --- 5 Second Auto-Payment Demo ---
function startCheckout() {
    if(cart.length === 0) return alert("Add items to cart first!");
    closeCart();
    
    const payOverlay = document.getElementById("paymentOverlay");
    payOverlay.style.display = "flex";
    gsap.to(payOverlay, { opacity: 1, duration: 0.3 });
}

function processAutoPayment() {
    // Hide form, show Loader
    document.getElementById("paymentForm").style.display = "none";
    document.getElementById("payTitle").style.display = "none";
    document.getElementById("paySubtitle").style.display = "none";
    document.getElementById("payLoader").style.display = "block";

    // 5 Second Delay (Simulating real gateway)
    setTimeout(() => {
        document.getElementById("payLoader").style.display = "none";
        document.getElementById("paySuccess").style.display = "block";
        
        // Confetti 🎉
        confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 }, colors: ['#2d6a4f', '#40916c', '#b7e4c7'] });

        // Empty Cart after success
        cart = [];
        document.getElementById("cartCount").innerText = "0";

    }, 5000); // <-- 5000 milliseconds = 5 Seconds
}

function closePayment() {
    gsap.to("#paymentOverlay", { opacity: 0, duration: 0.3, onComplete: () => {
        document.getElementById("paymentOverlay").style.display = "none";
        // Reset Modal for next time
        document.getElementById("paymentForm").style.display = "block";
        document.getElementById("payTitle").style.display = "block";
        document.getElementById("paySubtitle").style.display = "block";
        document.getElementById("paySuccess").style.display = "none";
        showSection('homeSection');
    }});
}

// --- Three.js 3D Background (Abstract Floating Elements) ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Create floating 'leaves' (Geometries)
const geometry = new THREE.IcosahedronGeometry(2, 0);
const material = new THREE.MeshStandardMaterial({ color: 0xb7e4c7, wireframe: true });
const shape1 = new THREE.Mesh(geometry, material);
shape1.position.set(-6, 2, -5);
scene.add(shape1);

const shape2 = new THREE.Mesh(geometry, material);
shape2.position.set(6, -2, -8);
scene.add(shape2);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

camera.position.z = 5;

function animate3D() {
    requestAnimationFrame(animate3D);
    shape1.rotation.x += 0.002;
    shape1.rotation.y += 0.003;
    shape2.rotation.x -= 0.001;
    shape2.rotation.y += 0.004;
    renderer.render(scene, camera);
}
animate3D();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
