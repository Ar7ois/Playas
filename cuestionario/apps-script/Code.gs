/**
 * Servicio de recepción de fotos y respaldos · Cuestionario de Caracterización de Playas
 *
 * Estructura que crea en la carpeta raíz de Drive:
 *   <Playa>/<NNN Ítem>/   una carpeta por cada uno de los 46 ítems
 *   <Playa>/Otras/        fotos adicionales
 *   <Playa>/Recorrido_….kml  recorrido GPS y fotos georreferenciadas
 *   Datos_<persona>_<teléfono>_parteN.xlsx  Excel de cada teléfono (se reemplaza en cada envío)
 *   _Registros/           respaldos de datos (JSON) enviados desde el cuestionario
 *
 * Instalación: ver README.md del repositorio (Implementar > Nueva implementación > Aplicación web).
 */
const ROOT_ID = '1DVhVQYuH-3z_SpyECU_i74dEsd6C10xM';
const TOKEN = 'CAMBIA-ESTA-CLAVE';   // la misma clave se escribe en el cuestionario (Fotos y envío a Drive)

const ITEMS = [
  "001 Acceso público",
  "002 Estacionamiento",
  "003 Tránsito libre",
  "004 Estancia recreativa",
  "005 Baño seguro / contacto con agua",
  "006 Actividades acuáticas",
  "008 Baños y regaderas",
  "010 Prestadores y comercio autorizado",
  "011 Proveeduría",
  "012 Línea de costa",
  "013 Conservación / protección ecosistémica",
  "016 Privatización / invasión",
  "018 Aplicación operativa de la zonificación",
  "020 Distribución de mobiliario en playa",
  "023 Áreas de carga, descarga y abastecimiento",
  "024 Conectividad con el entorno urbano, natural o turístico",
  "025 Senderos y pasarelas de conexión",
  "026 Accesos físicos a la playa: rampas, escaleras, senderos y puentes",
  "029 Elementos de accesibilidad universal: barandales, baños accesibles, señalética y apoyos de orientación",
  "031 Erosión",
  "034 Bancos de arena",
  "035 Formaciones rocosas",
  "038 Ecosistemas y formaciones naturales costeras",
  "046 Señalética de riesgo visible para el visitante",
  "050 Módulos de información",
  "053 Información sobre riesgos y reglamento",
  "065 Barrido y limpieza de playa",
  "066 Limpieza de espejo de agua",
  "067 Sanitarios públicos",
  "068 Regaderas / lavapiés",
  "069 Contenedores de basura",
  "070 Manejo de residuos",
  "071 Descargas al mar (conocidas)",
  "072 Torres / puestos de salvavidas",
  "073 Cobertura de salvavidas (personal)",
  "074 Horario de operación de salvavidas",
  "076 Banderas e indicadores de riesgo visibles",
  "078 Balizas y bolardos",
  "079 Módulos de seguridad / vigilancia fija",
  "084 Información de horarios de uso y operación",
  "085 Señalamientos horizontales",
  "086 Señalamientos verticales de orientación",
  "087 Señalética de seguridad y reglamentación",
  "088 Mapa físico de playa",
  "093 Sombra, descanso y confort climático",
  "094 Mobiliario y distribución"
];

const PLAYAS = [
  "1. Playa Pie de la Cuesta 1",
  "2. Playa Pie de la Cuesta 2",
  "3. Playa Poza Azul",
  "4. Playa Las Ardillas (Monjitas)",
  "5. Playa Mimosa",
  "6. Playa El Secreto Bella Miel",
  "7. Playa La Angosta",
  "8. Playa Caletilla",
  "9. Playa Caleta",
  "10. Playa La Roqueta",
  "11. La Roqueta-Playa Las Palmitas",
  "12. La Roqueta-Playa de los Enamorados",
  "13. La Roqueta-Playa del Amor",
  "14. Playa La Aguada",
  "15. Playa Larga",
  "16. Playa Honda",
  "17. Playa Manzanillo",
  "18. Playa Tlacopanocha",
  "19. Playa Hornitos",
  "20. Playa Hamacas",
  "21. Playa Dominguillo",
  "22. Playa Suave",
  "23. Playa Tamarindos",
  "24. Playa Hornos-Karabalí",
  "25. Playa Papagayo",
  "26. Playa El Morro-Magallanes",
  "27. Playa Condesa",
  "28. Playa Icacos I",
  "29. Playa Icacos II",
  "30. Playa Icacos III",
  "31. Playa Icacos IV",
  "32. Playa Guitarrón",
  "33. Playa del Secreto",
  "34. Playa Las Brisas",
  "35. Playa Pichilingue",
  "36. Playa Wellita",
  "37. Playa Palmita Sola",
  "38. Playa Puerto Marqués",
  "39. Playa Hermosa",
  "40. Playa Majahua",
  "41. Playa Revolcadero/Princess",
  "42. Playa La Torre",
  "43. Playa Diamante 1",
  "44. Playa Diamante 2",
  "45. Playa San Vicente (Dentro de Playa La Bonfil)",
  "46. Playa La Bonfil",
  "47. Playa La Gloria",
  "48. Playa Tres Vidas",
  "49. Playa Encantada",
  "50. Playa Barra Vieja"
];

function doGet() {
  return salida({ ok: true, servicio: 'Cuestionario de Caracterización de Playas · recepción de fotos' });
}

function doPost(e) {
  try {
    const p = JSON.parse(e.postData.contents);
    if (TOKEN && p.token !== TOKEN) return salida({ ok: false, error: 'Clave incorrecta' });
    if (p.accion === 'ping') return salida({ ok: true });
    if (p.accion === 'foto') {
      const carpetaPlaya = obtenerCarpetaPlaya(p.playa);
      const destino = obtenerSubcarpeta(carpetaPlaya, p.carpeta || 'Otras');
      const blob = Utilities.newBlob(Utilities.base64Decode(p.data), p.mime || 'image/jpeg', p.nombre);
      const existente = destino.getFilesByName(p.nombre);
      if (existente.hasNext()) { const f = existente.next(); return salida({ ok: true, id: f.getId(), url: f.getUrl(), repetida: true }); }
      const archivo = destino.createFile(blob);
      const desc = [];
      if (p.comentario) desc.push(String(p.comentario));
      if (p.lat != null && p.lon != null) desc.push('Coordenada: ' + p.lat + ', ' + p.lon + (p.acc != null ? ' (±' + p.acc + ' m)' : ''));
      if (desc.length) archivo.setDescription(desc.join('\n'));
      return salida({ ok: true, id: archivo.getId(), url: archivo.getUrl() });
    }
    if (p.accion === 'kml') {
      const carpetaPlaya = obtenerCarpetaPlaya(p.playa);
      const it = carpetaPlaya.getFilesByName(p.nombre);
      if (it.hasNext()) { const f = it.next(); f.setContent(p.data); return salida({ ok: true, id: f.getId(), url: f.getUrl(), actualizado: true }); }
      const archivo = carpetaPlaya.createFile(p.nombre, p.data, 'application/vnd.google-earth.kml+xml');
      return salida({ ok: true, id: archivo.getId(), url: archivo.getUrl() });
    }
    if (p.accion === 'excel') {
      const raiz = DriveApp.getFolderById(ROOT_ID);
      const nombre = p.nombre || ('Datos_' + Date.now() + '.xlsx');
      const viejos = raiz.getFilesByName(nombre);
      while (viejos.hasNext()) viejos.next().setTrashed(true);
      const blob = Utilities.newBlob(Utilities.base64Decode(p.data), p.mime || MimeType.MICROSOFT_EXCEL, nombre);
      const archivo = raiz.createFile(blob);
      return salida({ ok: true, id: archivo.getId(), url: archivo.getUrl() });
    }
    if (p.accion === 'datos') {
      const raiz = DriveApp.getFolderById(ROOT_ID);
      const reg = buscarOCrear(raiz, '_Registros');
      const archivo = reg.createFile(p.nombre || ('respaldo_' + Date.now() + '.json'), p.data, MimeType.PLAIN_TEXT);
      return salida({ ok: true, id: archivo.getId(), url: archivo.getUrl() });
    }
    return salida({ ok: false, error: 'Acción no reconocida' });
  } catch (err) {
    return salida({ ok: false, error: String(err) });
  }
}

function obtenerCarpetaPlaya(nombre) {
  if (!nombre) throw new Error('Falta el nombre de la playa');
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const raiz = DriveApp.getFolderById(ROOT_ID);
    const it = raiz.getFoldersByName(nombre);
    if (it.hasNext()) return it.next();
    const carpeta = raiz.createFolder(nombre);
    ITEMS.forEach(function (i) { carpeta.createFolder(i); });
    carpeta.createFolder('Otras');
    return carpeta;
  } finally {
    lock.releaseLock();
  }
}

function obtenerSubcarpeta(padre, nombre) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try { return buscarOCrear(padre, nombre); } finally { lock.releaseLock(); }
}

function buscarOCrear(padre, nombre) {
  const it = padre.getFoldersByName(nombre);
  return it.hasNext() ? it.next() : padre.createFolder(nombre);
}

function salida(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Opcional: crea de una vez la estructura de las 50 playas (playa, 46 ítems y Otras).
 * Ejecútala desde el editor. Si se agota el tiempo de ejecución, vuelve a ejecutarla:
 * continúa con las playas que faltan.
 */
function crearEstructuraCompleta() {
  const inicio = Date.now();
  const raiz = DriveApp.getFolderById(ROOT_ID);
  for (let k = 0; k < PLAYAS.length; k++) {
    if (Date.now() - inicio > 300000) { Logger.log('Tiempo agotado en ' + PLAYAS[k] + '. Vuelve a ejecutar.'); return; }
    const pf = buscarOCrear(raiz, PLAYAS[k]);
    ITEMS.concat(['Otras']).forEach(function (n) { buscarOCrear(pf, n); });
    Logger.log('Lista: ' + PLAYAS[k]);
  }
  Logger.log('Estructura completa.');
}
