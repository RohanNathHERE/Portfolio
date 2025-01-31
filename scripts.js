document.addEventListener('DOMContentLoaded', () => {
    // Text animation setup
    const texts = [
        "where I explore the evolution and pharmacology of G Protein-Coupled Receptors (GPCRs).",
        "where I investigate the lineage-specific expansion of genes.",
        "where I conduct phylogenetic studies.",
        "where I study protein domain and structure.",
        "where I learn new R scripts and explore innovative ways of visualization."
    ];

    let index = 0;
    const animatedTextElement = document.getElementById('animated-text');

    if (animatedTextElement) {
        const typeSpeed = 50; // Typing speed in milliseconds
        const deleteSpeed = 30; // Deleting speed in milliseconds
        const pauseAfterTyping = 1000; // Pause after typing in milliseconds
        const pauseAfterDeleting = 500; // Pause after deleting in milliseconds

        /**
         * Simulates typing effect for the given text.
         * @param {string} text - The text to type.
         * @param {function} callback - The function to call after typing is complete.
         */
        function typeWriter(text, callback) {
            let i = 0;
            function typing() {
                if (i < text.length) {
                    animatedTextElement.textContent += text.charAt(i);
                    i++;
                    setTimeout(typing, typeSpeed);
                } else {
                    setTimeout(callback, pauseAfterTyping);
                }
            }
            typing();
        }

        /**
         * Simulates deleting effect for the current text.
         * @param {function} callback - The function to call after deleting is complete.
         */
        function deleteText(callback) {
            let length = animatedTextElement.textContent.length;
            function deleting() {
                if (length > 0) {
                    animatedTextElement.textContent = animatedTextElement.textContent.slice(0, -1);
                    length--;
                    setTimeout(deleting, deleteSpeed);
                } else {
                    setTimeout(callback, pauseAfterDeleting);
                }
            }
            deleting();
        }

        /**
         * Cycles through the texts array to display each text with typing and deleting effects.
         */
        function cycleTexts() {
            typeWriter(texts[index], () => {
                deleteText(() => {
                    index = (index + 1) % texts.length; // Move to the next text
                    cycleTexts(); // Repeat the cycle
                });
            });
        }

        cycleTexts(); // Start the text animation
    }

    // Smooth scrolling for research video section
    const videoSection = document.querySelector('.research-video');
    const videoLink = document.querySelector('.scroll-to-video');

    if (videoSection && videoLink) {
        videoLink.addEventListener('click', (event) => {
            event.preventDefault();
            videoSection.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the video section
        });
    }

    // Form validation
    const form = document.getElementById("myForm");
    if (form) {
        form.addEventListener("submit", (event) => {
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation pattern

            // Validate name, email, and message
            if (!name || !email || !message) {
                alert("Please fill in all the required fields.");
                event.preventDefault();
                return false;
            }

            // Validate email format
            if (!emailRegex.test(email)) {
                alert("Please enter a valid email address.");
                event.preventDefault();
                return false;
            }

            return true; // Form is valid
        });
    }

    // Hamburger menu toggle
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburgerMenu && navMenu) {
        hamburgerMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active'); // Toggle the active class
        });

        // Close the menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!hamburgerMenu.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active'); // Remove the active class
            }
        });
    }
});