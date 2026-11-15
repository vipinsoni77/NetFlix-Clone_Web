"use strict";

/* =========================================================
   Netflix India clone – Netflix2nd.js
   Features:
   1. English / हिन्दी language switcher (nav + footer synced)
   2. Email validation on both "Get Started" boxes
   3. Sign In / Sign Up modal (front-end demo, no backend)
   4. FAQ accordion (only one open at a time)
   5. Scroll reveal animation
   6. Trending cards: click / keyboard -> toast message
   7. Broken image fallbacks (posters, icons, logo)
   ========================================================= */

(function () {

    /* ---------- helpers ---------- */
    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    const store = {
        get(key)       { try { return localStorage.getItem(key); } catch (e) { return null; } },
        set(key, value){ try { localStorage.setItem(key, value); } catch (e) { /* ignore */ } }
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    /* ---------- Hindi translations (English is read from the HTML itself) ---------- */
    const hi = {
        signIn: "साइन इन",
        heroTitle: "असीमित फ़िल्में, <br> शो और बहुत कुछ",
        heroPrice: "₹149 से शुरू। कभी भी रद्द करें।",
        readyText: "देखने के लिए तैयार हैं? अपनी सदस्यता बनाने या फिर से शुरू करने के लिए अपना ईमेल डालें।",
        getStarted: "शुरू करें &gt;",
        emailPh: "ईमेल पता",
        trending: "अभी ट्रेंड में",
        reasonsTitle: "जुड़ने के और कारण",
        r1t: "अपने टीवी पर देखें",
        r1p: "स्मार्ट टीवी, प्लेस्टेशन, Xbox, Chromecast, Apple TV, ब्लू-रे प्लेयर और बहुत कुछ पर देखें।",
        r2t: "ऑफ़लाइन देखने के लिए अपने शो डाउनलोड करें",
        r2p: "अपने पसंदीदा शो आसानी से सेव करें और हमेशा कुछ न कुछ देखने के लिए तैयार रखें।",
        r3t: "हर जगह देखें",
        r3p: "अपने फ़ोन, टैबलेट, लैपटॉप और टीवी पर असीमित फ़िल्में और टीवी शो स्ट्रीम करें।",
        r4t: "बच्चों के लिए प्रोफ़ाइल बनाएँ",
        r4p: "बच्चों को उनके पसंदीदा किरदारों के साथ उनके लिए बनी जगह में रोमांच पर भेजें — आपकी सदस्यता के साथ मुफ़्त।",
        faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
        q1: "Netflix क्या है?",
        a1: "Netflix एक स्ट्रीमिंग सेवा है जो पुरस्कार विजेता टीवी शो, फ़िल्में, एनिमे, डॉक्यूमेंट्री और बहुत कुछ प्रदान करती है।<br><br>आप जब चाहें, जितना चाहें देख सकते हैं, वो भी बिना किसी विज्ञापन के।",
        q2: "Netflix की कीमत कितनी है?",
        a2: "अपने स्मार्टफ़ोन, टैबलेट, स्मार्ट टीवी, लैपटॉप या स्ट्रीमिंग डिवाइस पर Netflix देखें, एक तय मासिक शुल्क पर। प्लान ₹149 से ₹649 प्रति माह तक हैं।",
        q3: "मैं कहाँ देख सकता/सकती हूँ?",
        a3: "कहीं भी, कभी भी देखें। तुरंत देखने के लिए अपने Netflix खाते से साइन इन करें।",
        q4: "मैं कैसे रद्द करूँ?",
        a4: "Netflix लचीला है। कोई झंझट भरे अनुबंध नहीं और कोई प्रतिबद्धता नहीं।",
        q5: "Netflix पर मैं क्या देख सकता/सकती हूँ?",
        a5: "Netflix के पास फ़ीचर फ़िल्मों, डॉक्यूमेंट्री, टीवी शो और Netflix ओरिजिनल्स की विशाल लाइब्रेरी है।",
        q6: "क्या Netflix बच्चों के लिए अच्छा है?",
        a6: "Netflix किड्स अनुभव आपकी सदस्यता में शामिल है, ताकि माता-पिता का नियंत्रण बना रहे।",
        callText: "सवाल हैं? कॉल करें",
        f1: "सामान्य प्रश्न",
        f2: "निवेशक संबंध",
        f3: "गोपनीयता",
        f4: "स्पीड टेस्ट",
        f5: "सहायता केंद्र",
        f6: "नौकरियाँ",
        f7: "कुकी प्राथमिकताएँ",
        f8: "कानूनी सूचनाएँ",
        f9: "खाता",
        f10: "देखने के तरीके",
        f11: "कॉर्पोरेट जानकारी",
        f12: "सिर्फ़ Netflix पर",
        f13: "मीडिया सेंटर",
        f14: "उपयोग की शर्तें",
        f15: "हमसे संपर्क करें",
        country: "Netflix भारत",
        note: "यह पेज Google reCAPTCHA द्वारा सुरक्षित है ताकि यह सुनिश्चित हो सके कि आप बॉट नहीं हैं।"
    };

    /* ---------- UI messages (modal, errors, toasts) ---------- */
    const ui = {
        en: {
            required: "Email is required.",
            invalid: "Please enter a valid email address.",
            passShort: "Password must be at least 6 characters.",
            signinTitle: "Sign In",
            signupTitle: "Create your account",
            signinBtn: "Sign In",
            signupBtn: "Continue",
            emailPh: "Email address",
            passPh: "Password",
            switchToSignup: "New to Netflix?",
            switchToSignupLink: "Sign up now.",
            switchToSignin: "Already a member?",
            switchToSigninLink: "Sign in.",
            signedIn: "Signed in as {email} (demo)",
            signedUp: "Account created for {email} (demo)",
            poster: "Sign in to start watching!",
            close: "Close"
        },
        hi: {
            required: "ईमेल आवश्यक है।",
            invalid: "कृपया एक मान्य ईमेल पता दर्ज करें।",
            passShort: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
            signinTitle: "साइन इन",
            signupTitle: "अपना खाता बनाएँ",
            signinBtn: "साइन इन",
            signupBtn: "आगे बढ़ें",
            emailPh: "ईमेल पता",
            passPh: "पासवर्ड",
            switchToSignup: "Netflix पर नए हैं?",
            switchToSignupLink: "अभी साइन अप करें।",
            switchToSignin: "पहले से सदस्य हैं?",
            switchToSigninLink: "साइन इन करें।",
            signedIn: "{email} के रूप में साइन इन हुए (डेमो)",
            signedUp: "{email} के लिए खाता बन गया (डेमो)",
            poster: "देखना शुरू करने के लिए साइन इन करें!",
            close: "बंद करें"
        }
    };

    let lang = store.get("nf-lang") === "hi" ? "hi" : "en";
    const t = (key, vars = {}) => {
        let text = ui[lang][key] || ui.en[key] || key;
        Object.keys(vars).forEach(k => { text = text.replace("{" + k + "}", vars[k]); });
        return text;
    };

    /* =========================================================
       1. LANGUAGE SWITCHER
       ========================================================= */
    const originalText = {};
    const originalPlaceholder = {};

    $$("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (!(key in originalText)) originalText[key] = el.innerHTML.trim();
    });
    $$("[data-i18n-placeholder]").forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (!(key in originalPlaceholder)) originalPlaceholder[key] = el.getAttribute("placeholder");
    });

    const languageSelects = $$(".langbut, .footer-language select");

    function applyLanguage(newLang) {
        lang = newLang;
        store.set("nf-lang", lang);
        document.documentElement.lang = lang;

        $$("[data-i18n]").forEach(el => {
            const key = el.dataset.i18n;
            el.innerHTML = lang === "hi" ? (hi[key] || originalText[key]) : originalText[key];
        });

        $$("[data-i18n-placeholder]").forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            el.setAttribute("placeholder", lang === "hi" ? (hi[key] || originalPlaceholder[key]) : originalPlaceholder[key]);
        });

        languageSelects.forEach(s => { s.value = lang === "hi" ? "हिन्दी" : "English"; });

        // re-translate any visible email error
        $$(".email-error").forEach(err => {
            if (err.dataset.key) err.textContent = t(err.dataset.key);
        });

        if (modal.overlay && !modal.overlay.hidden) renderModal();
    }

    languageSelects.forEach(select => {
        select.addEventListener("change", () => {
            applyLanguage(select.value === "हिन्दी" ? "hi" : "en");
        });
    });

    /* =========================================================
       2. TOAST
       ========================================================= */
    const toastEl = document.createElement("div");
    toastEl.className = "toast";
    toastEl.setAttribute("role", "status");
    document.body.appendChild(toastEl);

    let toastTimer;
    function showToast(message) {
        toastEl.textContent = message;
        toastEl.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3200);
    }

    /* =========================================================
       3. SIGN IN / SIGN UP MODAL (built with JS)
       ========================================================= */
    const modal = {};
    let modalMode = "signin";
    let lastFocused = null;

    function buildModal() {
        const overlay = document.createElement("div");
        overlay.className = "modal-overlay";
        overlay.hidden = true;
        overlay.innerHTML = `
            <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
                <button class="modal-close" type="button">&times;</button>
                <h2 id="modalTitle"></h2>
                <form novalidate>
                    <input type="email" name="email" autocomplete="email">
                    <p class="field-error" data-for="email"></p>
                    <input type="password" name="password" autocomplete="current-password">
                    <p class="field-error" data-for="password"></p>
                    <button type="submit" class="modal-submit"></button>
                </form>
                <p class="modal-switch"><span></span><a href="#"></a></p>
            </div>`;
        document.body.appendChild(overlay);

        modal.overlay   = overlay;
        modal.title     = $("h2", overlay);
        modal.form      = $("form", overlay);
        modal.email     = $("input[name=email]", overlay);
        modal.password  = $("input[name=password]", overlay);
        modal.emailErr  = $("[data-for=email]", overlay);
        modal.passErr   = $("[data-for=password]", overlay);
        modal.submit    = $(".modal-submit", overlay);
        modal.switchTxt = $(".modal-switch span", overlay);
        modal.switchLnk = $(".modal-switch a", overlay);
        modal.close     = $(".modal-close", overlay);

        modal.close.addEventListener("click", closeModal);
        overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
        document.addEventListener("keydown", e => {
            if (e.key === "Escape" && !overlay.hidden) closeModal();
        });

        modal.switchLnk.addEventListener("click", e => {
            e.preventDefault();
            modalMode = modalMode === "signin" ? "signup" : "signin";
            clearModalErrors();
            renderModal();
        });

        modal.form.addEventListener("submit", e => {
            e.preventDefault();
            clearModalErrors();

            const email = modal.email.value.trim();
            const password = modal.password.value;
            let ok = true;

            if (!email) {
                setFieldError(modal.email, modal.emailErr, t("required"));
                ok = false;
            } else if (!emailRegex.test(email)) {
                setFieldError(modal.email, modal.emailErr, t("invalid"));
                ok = false;
            }

            if (password.length < 6) {
                setFieldError(modal.password, modal.passErr, t("passShort"));
                ok = false;
            }

            if (!ok) return;

            // Demo only: we never store the password.
            store.set("nf-user", email);
            closeModal();
            showToast(t(modalMode === "signin" ? "signedIn" : "signedUp", { email }));
        });
    }

    function setFieldError(input, errEl, message) {
        input.classList.add("invalid");
        errEl.textContent = message;
    }

    function clearModalErrors() {
        modal.email.classList.remove("invalid");
        modal.password.classList.remove("invalid");
        modal.emailErr.textContent = "";
        modal.passErr.textContent = "";
    }

    function renderModal() {
        const signin = modalMode === "signin";
        modal.title.textContent     = t(signin ? "signinTitle" : "signupTitle");
        modal.submit.textContent    = t(signin ? "signinBtn" : "signupBtn");
        modal.email.placeholder     = t("emailPh");
        modal.password.placeholder  = t("passPh");
        modal.password.autocomplete = signin ? "current-password" : "new-password";
        modal.switchTxt.textContent = t(signin ? "switchToSignup" : "switchToSignin");
        modal.switchLnk.textContent = t(signin ? "switchToSignupLink" : "switchToSigninLink");
        modal.close.setAttribute("aria-label", t("close"));
    }

    function openModal(mode, email = "") {
        modalMode = mode;
        lastFocused = document.activeElement;
        clearModalErrors();
        renderModal();
        modal.email.value = email;
        modal.password.value = "";
        modal.overlay.hidden = false;
        document.body.classList.add("no-scroll");
        setTimeout(() => (email ? modal.password : modal.email).focus(), 50);
    }

    function closeModal() {
        modal.overlay.hidden = true;
        document.body.classList.remove("no-scroll");
        if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    buildModal();

    $$(".signbut").forEach(btn => {
        btn.addEventListener("click", () => openModal("signin", store.get("nf-user") || ""));
    });

    /* =========================================================
       4. EMAIL BOXES (hero + footer)
       ========================================================= */
    const emailInputs = $$(".email-box input, .footer-email-box input");

    function setupEmailBox(box) {
        const input = $("input", box);
        const button = $("button", box);

        const err = document.createElement("p");
        err.className = "email-error";
        err.setAttribute("role", "alert");
        box.insertAdjacentElement("afterend", err);

        const showError = key => {
            err.dataset.key = key;
            err.textContent = t(key);
            input.classList.add("invalid");
            input.setAttribute("aria-invalid", "true");
        };

        const clearError = () => {
            delete err.dataset.key;
            err.textContent = "";
            input.classList.remove("invalid");
            input.removeAttribute("aria-invalid");
        };

        const submit = () => {
            const value = input.value.trim();
            if (!value)                    return showError("required");
            if (!emailRegex.test(value))   return showError("invalid");
            clearError();
            store.set("nf-user", value);
            openModal("signup", value);
        };

        button.addEventListener("click", submit);

        input.addEventListener("keydown", e => {
            if (e.key === "Enter") { e.preventDefault(); submit(); }
        });

        input.addEventListener("input", () => {
            if (input.classList.contains("invalid")) clearError();
            // keep hero & footer inputs in sync
            emailInputs.forEach(other => { if (other !== input) other.value = input.value; });
        });
    }

    $$(".email-box, .footer-email-box").forEach(setupEmailBox);

    /* =========================================================
       5. FAQ ACCORDION – only one open at a time
       ========================================================= */
    const faqItems = $$(".faq details");
    faqItems.forEach(item => {
        item.addEventListener("toggle", () => {
            if (!item.open) return;
            faqItems.forEach(other => { if (other !== item) other.open = false; });
        });
    });

    /* =========================================================
       6. TRENDING CARDS
       ========================================================= */
    $$(".card").forEach(card => {
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");

        const open = () => showToast(t("poster"));
        card.addEventListener("click", open);
        card.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
        });
    });

    /* =========================================================
       7. SCROLL REVEAL ANIMATION
       ========================================================= */
    const revealTargets = $$(
        ".trending h2, .card, .reasons h2, .reason-card, .faq h2, .faq details, .footer-signup"
    );

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if ("IntersectionObserver" in window && !reduceMotion) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealTargets.forEach(el => {
            const index = el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : 0;
            el.classList.add("reveal");
            el.style.setProperty("--d", (index % 5) * 0.08 + "s");
            observer.observe(el);
        });
    }

    /* =========================================================
       8. BROKEN IMAGE FALLBACKS
       ========================================================= */
    function onBroken(img, handler) {
        if (img.complete && img.naturalWidth === 0) {
            handler(img);
        } else {
            img.addEventListener("error", () => handler(img), { once: true });
        }
    }

    const posterSVG = "data:image/svg+xml;utf8," + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420">' +
        '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#e50914"/><stop offset="1" stop-color="#141414"/>' +
        '</linearGradient></defs>' +
        '<rect width="300" height="420" fill="url(#g)"/>' +
        '<text x="150" y="220" font-family="Arial" font-size="28" font-weight="700" ' +
        'fill="#fff" text-anchor="middle">NETFLIX</text></svg>'
    );

    $$(".card img").forEach(img => {
        onBroken(img, broken => { broken.src = posterSVG; });
    });

    const iconEmojis = ["📺", "⬇️", "🔭", "🧒"];
    $$(".icon-container img").forEach((img, i) => {
        onBroken(img, broken => {
            const span = document.createElement("span");
            span.className = "icon-fallback";
            span.textContent = iconEmojis[i] || "🎬";
            span.setAttribute("aria-hidden", "true");
            broken.replaceWith(span);
        });
    });

    const logo = $("nav img");
    if (logo) {
        onBroken(logo, broken => {
            const span = document.createElement("span");
            span.className = "logo-fallback";
            span.textContent = "NETFLIX";
            broken.replaceWith(span);
        });
    }

    /* =========================================================
       9. MISC
       ========================================================= */
    // Footer links use href="#": stop them from jumping to the top
    $$('a[href="#"]').forEach(a => a.addEventListener("click", e => e.preventDefault()));

    // Apply saved language on load
    applyLanguage(lang);

})();