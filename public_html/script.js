/* ============================================================
   OPTUNE — REBRANDED JAVASCRIPT
   Shader background, magnetic effects, scroll animations, etc.
   ============================================================ */
;(function(){
    'use strict';

    /* ──────────────────────────────────────
       WEBGL SHADER BACKGROUND
       ────────────────────────────────────── */
    function initShader(){
        var canvas = document.getElementById('shaderCanvas');
        if(!canvas) return;

        var gl;
        try { gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl'); } catch(e){}
        if(!gl){ canvas.style.display='none'; return; }

        var W,H;
        function resize(){
            W = canvas.clientWidth;
            H = canvas.clientHeight;
            if(canvas.width !== W || canvas.height !== H){
                canvas.width = W;
                canvas.height = H;
                gl.viewport(0,0,W,H);
            }
        }
        resize();
        window.addEventListener('resize',resize);

        // Vertex shader
        var vsSrc = [
            'attribute vec2 a_position;',
            'void main(){',
            '   gl_Position = vec4(a_position,0,1);',
            '}'
        ].join('\n');

        // Fragment shader — flowing energy waves
        var fsSrc = [
            'precision highp float;',
            'uniform vec2 u_res;',
            'uniform float u_time;',
            '',
            'void main(){',
            '   vec2 uv = gl_FragCoord.xy / u_res;',
            '   float t = u_time * 0.15;',
            '',
            '   // Flowing wave lines',
            '   float wave1 = sin(uv.x * 12.0 + t * 1.2) * cos(uv.y * 8.0 - t * 0.8);',
            '   float wave2 = sin((uv.x + uv.y) * 10.0 + t * 1.5) * 0.6;',
            '   float wave3 = cos(uv.y * 14.0 - t * 1.0) * sin(uv.x * 6.0 + t * 0.6);',
            '',
            '   float pattern = wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2;',
            '   pattern = pattern * 0.5 + 0.5;',
            '',
            '   // Color composition: deep navy + cyan + mint accents',
            '   vec3 navy = vec3(0.047,0.110,0.169);',
            '   vec3 cyan = vec3(0.0,0.682,0.937);',
            '   vec3 mint = vec3(0.0,1.0,0.969);',
            '',
            '   // Gradient from center',
            '   vec2 center = uv - 0.5;',
            '   float dist = length(center);',
            '',
            '   vec3 col = navy;',
            '',
            '   // Cyan glow from waves',
            '   float cyanGlow = smoothstep(0.2,0.8,pattern) * 0.12;',
            '   col += cyan * cyanGlow;',
            '',
            '   // Subtle mint streaks',
            '   float mintStreak = sin(uv.x * 20.0 + uv.y * 15.0 + t * 2.0) * 0.04;',
            '   col += mint * max(0.0,mintStreak);',
            '',
            '   // Radial vignette',
            '   float vignette = 1.0 - dist * 0.8;',
            '   col *= vignette;',
            '',
            '   // Horizontal banding light',
            '   float band = sin(uv.y * 5.0 + t * 0.5) * 0.03;',
            '   col += max(0.0,band);',
            '',
            '   gl_FragColor = vec4(col,1.0);',
            '}'
        ].join('\n');

        function compileShader(src,type){
            var s = gl.createShader(type);
            gl.shaderSource(s,src);
            gl.compileShader(s);
            if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){
                console.error('Shader error:',gl.getShaderInfoLog(s));
                return null;
            }
            return s;
        }

        var vs = compileShader(vsSrc,gl.VERTEX_SHADER);
        var fs = compileShader(fsSrc,gl.FRAGMENT_SHADER);
        if(!vs || !fs) return;

        var prog = gl.createProgram();
        gl.attachShader(prog,vs);
        gl.attachShader(prog,fs);
        gl.linkProgram(prog);
        if(!gl.getProgramParameter(prog,gl.LINK_STATUS)) return;

        gl.useProgram(prog);

        var posLoc = gl.getAttribLocation(prog,'a_position');
        var resLoc = gl.getUniformLocation(prog,'u_res');
        var timeLoc = gl.getUniformLocation(prog,'u_time');

        var verts = new Float32Array([-1,-1, 1,-1, -1,1, 1,1]);
        var buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,buf);
        gl.bufferData(gl.ARRAY_BUFFER,verts,gl.STATIC_DRAW);
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc,2,gl.FLOAT,false,0,0);

        var startTime = Date.now();

        function render(){
            var elapsed = (Date.now() - startTime) / 1000;
            gl.uniform2f(resLoc,W,H);
            gl.uniform1f(timeLoc,elapsed);
            gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
            requestAnimationFrame(render);
        }
        render();
    }

    /* ──────────────────────────────────────
       MAGNETIC BUTTON EFFECT
       ────────────────────────────────────── */
    function initMagnetic(){
        var btn = document.getElementById('btnDemo');
        if(!btn) return;

        var inner = btn.querySelector('.btn-magnetic-inner');

        btn.addEventListener('mousemove',function(e){
            var rect = btn.getBoundingClientRect();
            var x = e.clientX - rect.left - rect.width/2;
            var y = e.clientY - rect.top - rect.height/2;
            var dist = Math.sqrt(x*x + y*y);
            var maxDist = Math.max(rect.width,rect.height);
            var strength = Math.min(1,dist/maxDist) * 12;
            var tx = (x / (rect.width/2)) * strength;
            var ty = (y / (rect.height/2)) * strength;
            inner.style.transform = 'translate('+tx+'px,'+ty+'px)';
            btn.style.transform = 'translate('+(tx*0.3)+'px,'+(ty*0.3)+'px)';
        });

        btn.addEventListener('mouseleave',function(){
            inner.style.transform = '';
            btn.style.transform = '';
        });
    }

    /* ──────────────────────────────────────
       SPOTLIGHT CARD MOUSE TRACKING
       ────────────────────────────────────── */
    function initSpotlightCards(){
        var cards = document.querySelectorAll('.service-card');
        cards.forEach(function(card){
            var glow = card.querySelector('.card-glow');
            if(!glow) return;

            card.addEventListener('mousemove',function(e){
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                glow.style.setProperty('--mouse-x',x+'px');
                glow.style.setProperty('--mouse-y',y+'px');
            });
        });
    }

    /* ──────────────────────────────────────
       SCROLL REVEAL ANIMATIONS
       ────────────────────────────────────── */
    function initScrollReveal(){
        var els = document.querySelectorAll(
            '.service-card, .testimonial-card, .contact-card, '+
            '.about-grid, .vision-block, .value-chip, .contact-form-wrap, .section-head'
        );

        var observer = new IntersectionObserver(function(entries){
            entries.forEach(function(entry){
                if(entry.isIntersecting){
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        },{threshold:0.08, rootMargin:'0px 0px -40px 0px'});

        els.forEach(function(el){
            el.style.opacity = '0';
            el.style.transform = 'translateY(28px)';
            el.style.transition = 'opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)';
            observer.observe(el);
        });
    }

    /* ──────────────────────────────────────
       COUNTER ANIMATION
       ────────────────────────────────────── */
    function initCounter(){
        var el = document.querySelector('[data-count]');
        if(!el) return;

        var target = parseInt(el.dataset.count,10);
        var current = 0;
        var speed = 30;
        var increment = Math.ceil(target / speed);
        var observer = new IntersectionObserver(function(entries){
            entries.forEach(function(entry){
                if(entry.isIntersecting){
                    observer.unobserve(entry.target);
                    var timer = setInterval(function(){
                        current += increment;
                        if(current >= target){
                            current = target;
                            clearInterval(timer);
                        }
                        el.textContent = current;
                    },40);
                }
            });
        },{threshold:0.5});
        observer.observe(el);
    }

    /* ──────────────────────────────────────
       NAVBAR SCROLL EFFECT
       ────────────────────────────────────── */
    function initNavbar(){
        var navbar = document.getElementById('navbar');
        if(!navbar) return;

        window.addEventListener('scroll',function(){
            if(window.pageYOffset > 50){
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    /* ──────────────────────────────────────
       MOBILE MENU
       ────────────────────────────────────── */
    function initMobileMenu(){
        var hamburger = document.getElementById('navHamburger');
        var navLinks = document.getElementById('navLinks');
        if(!hamburger || !navLinks) return;

        hamburger.addEventListener('click',function(){
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close on link click
        var links = navLinks.querySelectorAll('a');
        links.forEach(function(link){
            link.addEventListener('click',function(){
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    /* ──────────────────────────────────────
       SMOOTH SCROLL
       ────────────────────────────────────── */
    function initSmoothScroll(){
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor){
            anchor.addEventListener('click',function(e){
                var href = this.getAttribute('href');
                if(href === '#' || href === '#privacidad') return;
                e.preventDefault();
                var target = document.querySelector(href);
                if(target){
                    var offset = 80;
                    var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({top:top,behavior:'smooth'});
                }
            });
        });
    }

    /* ──────────────────────────────────────
       PRIVACY MODAL
       ────────────────────────────────────── */
    function initModal(){
        var link = document.getElementById('privacy-link');
        var modal = document.getElementById('privacy-modal');
        var closeBtn = document.querySelector('.modal-close');
        var backdrop = document.querySelector('.modal-backdrop');

        if(link && modal){
            link.addEventListener('click',function(e){
                e.preventDefault();
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        function closeModal(){
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        if(closeBtn) closeBtn.addEventListener('click',closeModal);
        if(backdrop) backdrop.addEventListener('click',closeModal);

        document.addEventListener('keydown',function(e){
            if(e.key === 'Escape' && modal && modal.classList.contains('active')){
                closeModal();
            }
        });
    }

    /* ──────────────────────────────────────
       CONTACT FORM
       ────────────────────────────────────── */
    function initContactForm(){
        var form = document.getElementById('contact-form');
        if(!form) return;

        var btn = document.getElementById('formSubmitBtn');

        form.addEventListener('submit',function(e){
            e.preventDefault();

            var nombre = document.getElementById('nombre').value.trim();
            var email = document.getElementById('email').value.trim();
            var empresa = document.getElementById('empresa').value.trim();
            var mensaje = document.getElementById('mensaje').value.trim();

            // Validate
            var valid = true;
            form.querySelectorAll('.form-group').forEach(function(g){g.classList.remove('error');});

            if(!nombre){
                var gn = document.getElementById('nombre').closest('.form-group');
                gn.classList.add('error');
                gn.querySelector('.form-error').textContent = 'El nombre es obligatorio';
                valid = false;
            }
            if(!email){
                var ge = document.getElementById('email').closest('.form-group');
                ge.classList.add('error');
                ge.querySelector('.form-error').textContent = 'El email es obligatorio';
                valid = false;
            } else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
                var ge2 = document.getElementById('email').closest('.form-group');
                ge2.classList.add('error');
                ge2.querySelector('.form-error').textContent = 'Email invalido';
                valid = false;
            }

            if(!valid) return;

            // Sending
            btn.classList.add('loading');
            btn.disabled = true;

            fetch('send_email.php',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({nombre:nombre,email:email,empresa:empresa,mensaje:mensaje})
            })
            .then(function(r){return r.json();})
            .then(function(result){
                if(result.success){
                    showNotification('Gracias! Tu solicitud ha sido enviada. Te contactaremos pronto.','success');
                    form.reset();
                } else {
                    showNotification(result.message || 'Hubo un error. Intenta de nuevo.','error');
                }
            })
            .catch(function(){
                showNotification('Error de conexion. Por favor intenta de nuevo.','error');
            })
            .finally(function(){
                btn.classList.remove('loading');
                btn.disabled = false;
            });
        });
    }

    /* ──────────────────────────────────────
       NOTIFICATION SYSTEM
       ────────────────────────────────────── */
    function showNotification(msg,type){
        var existing = document.querySelector('.notification');
        if(existing) existing.remove();

        var notif = document.createElement('div');
        notif.className = 'notification notification-'+type;
        notif.innerHTML = '<span>'+msg+'</span><button class="notification-close">&times;</button>';

        document.body.appendChild(notif);

        notif.querySelector('.notification-close').addEventListener('click',function(){
            notif.remove();
        });

        setTimeout(function(){
            if(notif.parentNode){
                notif.style.opacity = '0';
                notif.style.transform = 'translateY(12px)';
                notif.style.transition = 'opacity 0.3s, transform 0.3s';
                setTimeout(function(){notif.remove();},300);
            }
        },5000);
    }

    /* ──────────────────────────────────────
       REVEAL SECTION TAGS ON SCROLL
       ────────────────────────────────────── */
    function initSectionTags(){
        var tags = document.querySelectorAll('.section-tag');
        var observer = new IntersectionObserver(function(entries){
            entries.forEach(function(entry){
                if(entry.isIntersecting){
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        },{threshold:0.3});

        tags.forEach(function(tag){
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(10px)';
            tag.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(tag);
        });
    }

    /* ──────────────────────────────────────
       INIT ALL
       ────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded',function(){
        initShader();
        initMagnetic();
        initSpotlightCards();
        initScrollReveal();
        initCounter();
        initNavbar();
        initMobileMenu();
        initSmoothScroll();
        initModal();
        initContactForm();
        initSectionTags();
    });

})();
