document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('inscripcionForm');
  const status = document.getElementById('status');
  const curso = document.getElementById('curso');

  const cursos = {
    'Nivel Inicial': ['Sala de 3', 'Sala de 4', 'Sala de 5'],
    'Nivel Primario': ['1° grado','2° grado','3° grado','4° grado','5° grado','6° grado'],
    'Nivel Secundario': ['1° año','2° año','3° año','4° año','5° año','6° año'],
    'Nivel Terciario': ['1° año','2° año','3° año','4° año','5° año']
  };

  document.querySelectorAll('input[name="nivel"]').forEach(radio => {
    radio.addEventListener('change', () => {
      curso.innerHTML = '<option value="">Seleccioná una opción</option>';
      cursos[radio.value].forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        curso.appendChild(option);
      });
      clearError('nivel');
      clearError('curso');
    });
  });

  function value(id) { return document.getElementById(id).value.trim(); }
  function clearError(id) {
    const el = document.getElementById(id);
    const err = document.getElementById('error-' + id);
    if (el) el.classList.remove('invalid');
    if (err) err.textContent = '';
  }
  function error(id, message) {
    const el = document.getElementById(id);
    const err = document.getElementById('error-' + id);
    if (el) el.classList.add('invalid');
    if (err) err.textContent = message;
  }
  function clearAll() {
    document.querySelectorAll('.help').forEach(e => e.textContent = '');
    document.querySelectorAll('.invalid').forEach(e => e.classList.remove('invalid'));
    status.className = 'status';
    status.textContent = '';
  }
  function checked(name) {
    return document.querySelector(`input[name="${name}"]:checked`);
  }
  function validDni(v) {
    return /^\d{7,8}$/.test(v.replace(/\D/g,''));
  }
  function validPhone(v) {
    return v.replace(/\D/g,'').length >= 8;
  }
  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearAll();
    let ok = true;

    const nivel = checked('nivel');
    const ciclo = value('ciclo');
    const nombre = value('nombre');
    const dni = value('dni');
    const fecha = value('fecha');
    const lugar = value('lugar');
    const domicilio = value('domicilio');
    const responsable = value('responsable');
    const dniResponsable = value('dniResponsable');
    const parentesco = value('parentesco');
    const telefono = value('telefono');
    const email = value('email');
    const pertenece = checked('pertenece');
    const procedencia = value('procedencia');
    const cursoValue = curso.value;

    if (!nivel) { document.getElementById('error-nivel').textContent = 'Seleccioná un nivel.'; ok=false; }
    if (!/^\d{4}$/.test(ciclo) || Number(ciclo) < 2024) { error('ciclo','Ingresá un año lectivo válido.'); ok=false; }
    if (!cursoValue) { error('curso','Seleccioná el curso, grado o año.'); ok=false; }
    if (nombre.length < 3) { error('nombre','Ingresá el nombre y apellido del estudiante.'); ok=false; }
    if (!validDni(dni)) { error('dni','Ingresá un DNI válido.'); ok=false; }
    if (!fecha || new Date(fecha + 'T00:00:00') > new Date()) { error('fecha','Ingresá una fecha de nacimiento válida.'); ok=false; }
    if (lugar.length < 2) { error('lugar','Ingresá el lugar de nacimiento.'); ok=false; }
    if (domicilio.length < 4) { error('domicilio','Ingresá el domicilio.'); ok=false; }
    if (responsable.length < 3) { error('responsable','Ingresá el nombre y apellido del responsable.'); ok=false; }
    if (!validDni(dniResponsable)) { error('dniResponsable','Ingresá un DNI válido.'); ok=false; }
    if (!parentesco) { error('parentesco','Seleccioná el parentesco.'); ok=false; }
    if (!validPhone(telefono)) { error('telefono','Ingresá un teléfono válido.'); ok=false; }
    if (!validEmail(email)) { error('email','Ingresá un email válido.'); ok=false; }
    if (!pertenece) { document.getElementById('error-pertenece').textContent = 'Seleccioná Sí o No.'; ok=false; }
    if (procedencia.length < 2) { error('procedencia','Ingresá la institución de procedencia.'); ok=false; }

    if (!ok) {
      status.textContent = 'Revisá los campos marcados antes de enviar.';
      status.className = 'status error';
      status.scrollIntoView({behavior:'smooth', block:'nearest'});
      return;
    }

    const key = 'inscripcionesINSM';
    let registros = [];
    try { registros = JSON.parse(localStorage.getItem(key) || '[]'); } catch (_) {}

    registros.push({
      id: Date.now(),
      nivel: nivel.value,
      ciclo,
      curso: cursoValue,
      nombre,
      dni,
      fechaNacimiento: fecha,
      lugarNacimiento: lugar,
      domicilio,
      responsable,
      dniResponsable,
      parentesco,
      telefono,
      email,
      perteneceINSM: pertenece.value,
      institucionProcedencia: procedencia,
      fechaRegistro: new Date().toLocaleString('es-AR')
    });

    localStorage.setItem(key, JSON.stringify(registros));
    form.reset();
    curso.innerHTML = '<option value="">Seleccioná primero el nivel</option>';
    status.textContent = '¡Solicitud enviada correctamente! La preinscripción quedó registrada.';
    status.className = 'status success';
    status.scrollIntoView({behavior:'smooth', block:'nearest'});
  });
});