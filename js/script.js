// Load Components (Navbar & Footer)
document.addEventListener("DOMContentLoaded", function () {
    loadComponents();
});

async function loadComponents() {
    try {
        // Load Navbar
        const navResponse = await fetch('components/navbar.html');
        if (navResponse.ok) {
            const navData = await navResponse.text();
            document.getElementById('navbar-placeholder').innerHTML = navData;

            // Re-initialize Navbar Logic
            highlightActiveLink();
            updateCartBadge(); // Ensure cart badge is updated after navbar load

            // Sticky Navbar Logic
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 50) {
                        navbar.classList.add('shadow-sm');
                    } else {
                        navbar.classList.remove('shadow-sm');
                    }
                });
            }
        }

        // Load Footer
        const footerResponse = await fetch('components/footer.html');
        if (footerResponse.ok) {
            const footerData = await footerResponse.text();
            document.getElementById('footer-placeholder').innerHTML = footerData;

            // Re-initialize Footer Logic
            const yearElem = document.getElementById('year');
            if (yearElem) {
                yearElem.textContent = new Date().getFullYear();
            }

            // Initialize WhatsApp Bubble
            initWhatsAppBubble();
        }

        // Initialize Scroll Animations
        initScrollReveal();

    } catch (error) {
        console.error("Error loading components:", error);
    }
}

function highlightActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function initWhatsAppBubble() {
    const bubble = document.getElementById("wa-bubble");
    if (bubble) {
        setTimeout(() => {
            bubble.style.display = "block";
            setTimeout(() => {
                bubble.style.display = "none";
            }, 5000);
        }, 2000);
    }
}

function openWAChat() {
    const waMsgs = [
        "Hi, I have an enquiry 😊",
        "Hello! I need more details.",
        "Hi i need to know more about your services",
        "Hey! send me more details"
    ];
    const waMsg = encodeURIComponent(waMsgs[Math.floor(Math.random() * waMsgs.length)]);
    window.open("https://wa.me/917305885870?text=" + waMsg, "_blank");
}

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        revealElements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load
}

// Preloader Logic
window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.style.opacity = "0";
        setTimeout(() => {
            preloader.style.display = "none";
        }, 500);
    }
});

// Helper to format WhatsApp message
function sendWhatsAppMessage(productName = '') {
    const phoneNumber = "YOURNUMBER"; // Replace with actual number
    let text = "Hi, I want to customize a gift.";
    if (productName) {
        text = `Hi, I am interested in ${productName}. Can you share more details?`;
    }
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, '_blank');
}

// Cart Logic
let cart = JSON.parse(localStorage.getItem('myCart')) || [];

function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function saveCart() {
    localStorage.setItem('myCart', JSON.stringify(cart));
    updateCartBadge();
}

function addToCart(name, price, image) {
    // Sanitize price string to number
    // Assuming price format could be "₹499" or "₹499 - ₹999" (take lower)
    let numericPrice = 0;
    if (typeof price === 'string') {
        let match = price.match(/(\d+)/);
        if (match) {
            numericPrice = parseInt(match[0], 10);
        }
    } else {
        numericPrice = price;
    }

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: numericPrice,
            image: image,
            quantity: 1
        });
    }

    saveCart();
    showToast(`Added ${name} to cart!`);
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    if (typeof renderCartItems === 'function') {
        renderCartItems();
    }
}

function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            saveCart();
            if (typeof renderCartItems === 'function') {
                renderCartItems();
            }
        }
    }
}

// Toast Notification
function showToast(message) {
    // Create toast container if not exists
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        // Check if we are in body before appending to avoid errors if script loads fast?
        // Actually usually script is defer or at end of body.
        document.body.appendChild(container);
    }

    const toastHtml = `
        <div class="toast align-items-center text-white bg-success border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close" onclick="this.closest('.toast').remove()"></button>
            </div>
        </div>
    `;

    // Append toast
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = toastHtml.trim();
    const toastEl = tempDiv.firstChild;
    container.appendChild(toastEl);

    // Auto remove
    setTimeout(() => {
        toastEl.remove();
    }, 3000);
}

// Initialize Cart Badge on Load
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();

    // Product Filtering Logic
    const filterButtons = document.querySelectorAll('button[data-filter]');
    const productCards = document.querySelectorAll('div[data-category]');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = ''; // Reset to default (visible)
                } else {
                    card.style.display = 'none'; // Hide
                }
            });
        });
    });
});
