var API_BASE = "https://outdoor-event.ru";
var CLIENT_KEY = "bYX63tTmrIkjBgTyjXeD";
var counterId = 108234394;
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initHeaderScroll();
    initScrollAnimations();
    initSmoothScroll();
    initProtectedLinks();
    initContactForm();
});
function initMobileMenu() {
    var btn = document.getElementById('hamburgerBtn') || document.querySelector('.hamburger');
    var menu = document.getElementById('mobileMenu') || document.querySelector('.menu');
    var toggler = document.querySelector('.toggler');
    if (!btn || !menu) return;
    btn.addEventListener('click', function() {
        btn.classList.toggle('active');
        menu.classList.toggle('active');
    });
    document.querySelectorAll('.menu a, .hamburger-off').forEach(function(link) {
        link.addEventListener('click', function() {
            btn.classList.remove('active');
            menu.classList.remove('active');
            if (toggler) toggler.checked = false;
        });
    });
}
function initHeaderScroll() {
    var header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (header) header.classList.toggle('scrolled', window.scrollY > 50);
    });
}
function initScrollAnimations() {
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.card, .split-layout, .hero-content').forEach(function(el) {
        observer.observe(el);
    });
}
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}
function initProtectedLinks() {
    document.querySelectorAll('.js-link-p').forEach(function(el) {
        el.onclick = function() { window.location.href = atob('dGVsOis3OTE2NTAxMzg2NQ=='); };
    });
    document.querySelectorAll('.js-link-e').forEach(function(el) {
        el.onclick = function() { window.location.href = atob('bWFpbHRvOm1vamJ1aGdhbHRlckB5YW5kZXgucnU='); };
    });
}
function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.onsubmit = async function(e) {
        e.preventDefault();
        var btn = document.getElementById('submitBtn');
        var msgBox = document.getElementById('formMessage');
        
        // Сбрасываем старые сообщения
        msgBox.innerHTML = '';
        msgBox.className = '';

        if (form.name.value.length < 2 || form.phone.value.length < 10) {
            msgBox.innerHTML = 'Пожалуйста, заполните имя и телефон';
            msgBox.className = 'msg-error';
            return;
        }

        btn.classList.add('loading');
        btn.disabled = true;

        try {
            // ШАГ 1: Рукопожатие (Nonce)
            var nRes = await fetch(API_BASE + "/api/mbfeedback/nonce");
            var nData = await nRes.json();

            // ШАГ 2: Сбор данных
            var formData = new FormData(form);
            var payload = Object.fromEntries(formData);
            payload.timestamp = nData.timestamp;
            payload.nonce = nData.nonce;
            payload.signature = nData.signature;
            payload.client_key = CLIENT_KEY;

            // ШАГ 3: Отправка
            var res = await fetch(API_BASE + "/api/mbfeedback", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                // ПОКАЗЫВАЕМ УСПЕХ
                msgBox.innerHTML = 'Спасибо! Ваш запрос успешно отправлен. Я свяжусь с вами в ближайшее время.';
                msgBox.className = 'msg-success';
                
                form.reset(); // Очищаем поля
                if (typeof ym !== 'undefined') ym(counterId, 'reachGoal', 'form_success');
            } else {
                throw new Error('Ошибка сервера');
            }
        } catch (err) {
            // ПОКАЗЫВАЕМ ОШИБКУ
            msgBox.innerHTML = 'Произошла ошибка при отправке. Попробуйте позже или позвоните мне.';
            msgBox.className = 'msg-error';
        } finally {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    };
}