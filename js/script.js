document.addEventListener('DOMContentLoaded', function () {
    // Dynamic Year in Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Sticky Navbar shadow on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-sm');
        } else {
            navbar.classList.remove('shadow-sm');
        }
    });

    // AOS Animation initialization (if we add AOS later, placeholder for now)
    // console.log("Scripts loaded");

    // Add simple reveal on scroll for elements with 'reveal' class
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
});

// Preloader Logic
window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        // Delay hiding by 1.5s to show animation
        setTimeout(() => {
            preloader.style.opacity = "0";
            setTimeout(() => {
                preloader.style.display = "none";
            }, 500);
        }, 1500);
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
