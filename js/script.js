// =====================================================
// ANIMACIÓN DE BARRAS + ENTRADA DE HABILIDADES (se repite al hacer scroll)
// =====================================================
document.addEventListener('DOMContentLoaded', function () {
    const habilidades = document.querySelectorAll('.habilidad');

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            const habilidad = entry.target;
            const barra = habilidad.querySelector('.progreso');

            if (entry.isIntersecting) {
                // Entrada
                habilidad.classList.add('visible');

                // Barra de progreso
                if (barra) {
                    const porcentaje = barra.getAttribute('data-porcentaje') || 80;
                    setTimeout(function () {
                        barra.style.width = porcentaje + '%';
                    }, 150);
                }
            } else {
                // Sale de pantalla → reset para que vuelva a animar al entrar de nuevo
                habilidad.classList.remove('visible');
                if (barra) {
                    barra.style.width = '0%';
                }
            }
        });
    }, {
        threshold: 0.25,
        rootMargin: '0px 0px -40px 0px'
    });

    habilidades.forEach(function (hab) {
        observer.observe(hab);
    });
});

// =====================================================
// MENÚ HAMBURGUESA
// =====================================================
document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('nav');
    const header = document.querySelector('header');

    const hamburgerBtn = document.createElement('button');
    hamburgerBtn.className = 'hamburger-btn';
    hamburgerBtn.innerHTML = '☰';
    hamburgerBtn.setAttribute('aria-label', 'Menú');
    header.appendChild(hamburgerBtn);

    hamburgerBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            nav.classList.remove('open');
        });
    });

    document.addEventListener('click', function (e) {
        if (!header.contains(e.target)) {
            nav.classList.remove('open');
        }
    });

    function handleResize() {
        if (window.innerWidth > 768) {
            nav.classList.remove('open');
            nav.style.display = '';
            nav.style.position = '';
            nav.style.backgroundColor = '';
            nav.style.flexDirection = '';
            nav.style.gap = '';
            nav.style.padding = '';
            nav.style.width = '';
            nav.style.borderTop = '';
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize();
});

// =====================================================
// FORMULARIO: validación en tiempo real + DOM + events
// =====================================================
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-contacto');
    if (!form) return;

    const nombreInput  = document.getElementById('nombre');
    const emailInput   = document.getElementById('email');
    const mensajeInput = document.getElementById('mensaje');
    const btnEnviar    = document.getElementById('btn-enviar');
    const mensajeForm  = document.getElementById('mensaje-form');
    const contadorMsg  = document.getElementById('contador-mensaje');

    const errorNombre  = document.getElementById('error-nombre');
    const errorEmail   = document.getElementById('error-email');
    const errorMensaje = document.getElementById('error-mensaje');

    const MAX_MENSAJE = 500;

    function validarNombre(valor) {
        const texto = valor.trim();
        if (texto === '') return 'El nombre es obligatorio.';
        if (texto.length < 2) return 'El nombre debe tener al menos 2 caracteres.';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(texto)) {
            return 'El nombre solo puede contener letras y espacios.';
        }
        return '';
    }

    function validarEmail(valor) {
        const texto = valor.trim();
        if (texto === '') return 'El email es obligatorio.';
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(texto)) return 'Ingresa un email válido (ej: tu@email.com).';
        return '';
    }

    function validarMensaje(valor) {
        const texto = valor.trim();
        if (texto === '') return 'El mensaje es obligatorio.';
        if (texto.length < 10) return 'El mensaje debe tener al menos 10 caracteres.';
        if (texto.length > MAX_MENSAJE) return `Máximo ${MAX_MENSAJE} caracteres.`;
        return '';
    }

    function mostrarError(input, errorSpan, mensaje) {
        if (mensaje) {
            input.classList.remove('valido');
            input.classList.add('invalido');
            errorSpan.textContent = mensaje;
        } else {
            input.classList.remove('invalido');
            input.classList.add('valido');
            errorSpan.textContent = '';
        }
    }

    function actualizarContador() {
        const longitud = mensajeInput.value.length;
        contadorMsg.textContent = `${longitud} / ${MAX_MENSAJE}`;
        contadorMsg.classList.toggle('limite', longitud > MAX_MENSAJE);
    }

    function mostrarMensajeForm(texto, tipo) {
        mensajeForm.hidden = false;
        mensajeForm.textContent = texto;
        mensajeForm.className = 'mensaje-form ' + tipo;
    }

    function ocultarMensajeForm() {
        mensajeForm.hidden = true;
        mensajeForm.textContent = '';
        mensajeForm.className = 'mensaje-form';
    }

    nombreInput.addEventListener('input', function () {
        const error = validarNombre(this.value);
        mostrarError(this, errorNombre, error);
        ocultarMensajeForm();
    });

    nombreInput.addEventListener('blur', function () {
        const error = validarNombre(this.value);
        mostrarError(this, errorNombre, error);
    });

    emailInput.addEventListener('input', function () {
        const error = validarEmail(this.value);
        mostrarError(this, errorEmail, error);
        ocultarMensajeForm();
    });

    emailInput.addEventListener('blur', function () {
        const error = validarEmail(this.value);
        mostrarError(this, errorEmail, error);
    });

    mensajeInput.addEventListener('input', function () {
        actualizarContador();
        const error = validarMensaje(this.value);
        mostrarError(this, errorMensaje, error);
        ocultarMensajeForm();
    });

    mensajeInput.addEventListener('blur', function () {
        const error = validarMensaje(this.value);
        mostrarError(this, errorMensaje, error);
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const errNombre  = validarNombre(nombreInput.value);
        const errEmail   = validarEmail(emailInput.value);
        const errMensaje = validarMensaje(mensajeInput.value);

        mostrarError(nombreInput, errorNombre, errNombre);
        mostrarError(emailInput, errorEmail, errEmail);
        mostrarError(mensajeInput, errorMensaje, errMensaje);

        const esValido = !errNombre && !errEmail && !errMensaje;

        if (!esValido) {
            mostrarMensajeForm('Por favor corrige los errores antes de enviar.', 'error');
            if (errNombre) nombreInput.focus();
            else if (errEmail) emailInput.focus();
            else mensajeInput.focus();
            return;
        }

        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Enviando...';

        setTimeout(function () {
            mostrarMensajeForm('¡Mensaje enviado con éxito! Te responderé pronto.', 'exito');

            form.reset();
            nombreInput.classList.remove('valido', 'invalido');
            emailInput.classList.remove('valido', 'invalido');
            mensajeInput.classList.remove('valido', 'invalido');
            errorNombre.textContent = '';
            errorEmail.textContent = '';
            errorMensaje.textContent = '';
            actualizarContador();

            btnEnviar.disabled = false;
            btnEnviar.textContent = 'Enviar mensaje';

            setTimeout(ocultarMensajeForm, 5000);
        }, 900);
    });

    actualizarContador();
});