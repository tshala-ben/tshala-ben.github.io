document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll
    const scrollLinks = document.querySelectorAll('a.nav-link');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 50, // Ajustez l'offset selon vos besoins
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll animations
    const sections = document.querySelectorAll('section');
    const options = {
        threshold: 0.25
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Form submission
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            fetch('/path/to/your/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(result => {
                alert('Message sent successfully!');
                contactForm.reset(); // Optionnel : réinitialise le formulaire après l'envoi
            })
            .catch(error => {
                alert('There was an error sending your message: ' + error.message);
            });
        });
    }

    
    
});

document.addEventListener('DOMContentLoaded', function() {
    // Ajoute une animation de focus sur les champs du formulaire
    const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 5px rgba(0, 123, 255, 0.5)';
        });
        
        input.addEventListener('blur', function() {
            this.style.boxShadow = 'none';
        });
    });

    // Form submission
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Simulation d'une soumission de formulaire
            setTimeout(function() {
                alert('Message envoyé avec succès !');
                contactForm.reset(); // Réinitialise le formulaire
            }, 500);
        });
    }
});
