document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    
    // Fetch manifest and update title and description
    fetchManifest();

    // Update current year in footer
    updateCurrentYear();

    // Add event listener for newsletter form submission
    setupNewsletterForm();

    // Add event listeners for "Add to Cart" buttons
    setupAddToCartButtons();
});

function fetchManifest() {
    fetch('/manifest.json')
        .then(response => response.json())
        .then(manifest => {
            document.title = `${manifest.name} - ${manifest.tagline}`;
            document.querySelector('meta[name="description"]').setAttribute('content', manifest.description);
        })
        .catch(error => console.error('Error loading manifest:', error));
}

function updateCurrentYear() {
    const currentYearElement = document.querySelector('#current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

function setupNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
}

function handleNewsletterSubmit(e) {
    e.preventDefault();
    // Add newsletter subscription logic here
    console.log('Newsletter form submitted');
}

function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
}

function handleAddToCart() {
    // Add to cart logic here
    console.log('Product added to cart');
}
