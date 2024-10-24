document.addEventListener('DOMContentLoaded', () => {
    const texts = [
        "where I explore the evolution and pharmacology of G Protein-Coupled Receptors (GPCRs).",
        "where I investigate the lineage-specific expansion of genes.",
        "where I conduct phylogenetic studies.",
        "where I study protein domain and structure.",
        "where I learn new R scripts and explore innovative ways of visualization."
    ];

    let index = 0;
    const animatedTextElement = document.getElementById('animated-text');
    console.log('Animated text element:', animatedTextElement);

    if (animatedTextElement) {  // Check if element exists before proceeding
        function typeWriter(text, callback) {
            let i = 0;
            const speed = 50;

            function typing() {
                if (i < text.length) {
                    animatedTextElement.textContent += text.charAt(i);
                    i++;
                    setTimeout(typing, speed);
                } else if (callback) {
                    setTimeout(callback, 1000);
                }
            }

            typing();
        }

        function deleteText(callback) {
            let i = animatedTextElement.textContent.length;
            const speed = 30;

            function deleting() {
                if (i > 0) {
                    animatedTextElement.textContent = animatedTextElement.textContent.substring(0, i - 1);
                    i--;
                    setTimeout(deleting, speed);
                } else if (callback) {
                    setTimeout(callback, 500);
                }
            }

            deleting();
        }

        function cycleTexts() {
            typeWriter(texts[index], () => {
                deleteText(() => {
                    index = (index + 1) % texts.length;
                    cycleTexts();
                });
            });
        }

        cycleTexts();
    }

    // Smooth scrolling for research video
    const videoSection = document.querySelector('.research-video');
    if (videoSection) {
        const videoLink = document.querySelector('.scroll-to-video');
        if (videoLink) {
            videoLink.addEventListener('click', (event) => {
                event.preventDefault();
                videoSection.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }

    // Form validation
    function validateForm(event) {
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (name === "" || email === "" || message === "") {
            alert("Please fill in all the required fields.");
            event.preventDefault(); // Prevent form submission if validation fails
            return false;
        }

        return true;
    }

    const form = document.getElementById("myForm");
    if (form) {
        form.addEventListener("submit", validateForm);
    }

    // Hamburger menu toggle
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');

    console.log('Hamburger menu:', hamburgerMenu);
    console.log('Nav menu:', navMenu);

    if (hamburgerMenu && navMenu) {
        hamburgerMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close the menu when it loses focus (optional, for better UX)
        document.addEventListener('click', (event) => {
            if (!hamburgerMenu.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
});
