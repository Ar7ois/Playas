# Cuestionario de Caracterización de Playas

Versión borrador 8, con la identidad gráfica de Jefe Marino (logotipo, paleta, iconos y fondo de olas) y 28 imágenes de referencia por ítem. Aplicación web de una sola página para el levantamiento de 46 ítems y de la encuesta de percepción. Funciona sin internet una vez abierta por primera vez.

## Contenido del repositorio

| Archivo | Uso |
|---|---|
| `index.html` | Cuestionario completo (datos, lógica y estilos en un solo archivo) |
| `sw.js` | Guarda la aplicación en el teléfono para usarla sin internet |
| `manifest.webmanifest`, `icon.svg` | Permiten instalarla como aplicación en el teléfono |
| `img/` | Imágenes de referencia por ítem (`item-001.jpg`, `item-002.jpg`…) |
| `apps-script/Code.gs` | Servicio de Google que recibe las fotos y crea las carpetas en Drive |

## 1. Publicar en GitHub Pages

1. Sube todos los archivos a la raíz de un repositorio (por ejemplo `Ar7ois/cedula-playas`).
2. En el repositorio: **Settings › Pages › Build and deployment › Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. La dirección quedará como `https://ar7ois.github.io/cedula-playas/`.

## 2. Usarlo sin internet

1. Abre la dirección una vez con internet en cada teléfono.
2. En Android (Chrome): menú ⋮ › **Agregar a pantalla principal** / **Instalar aplicación**. En iPhone (Safari): Compartir › **Agregar a inicio**.
3. Desde ese momento se abre sin conexión. Las respuestas y las fotos se guardan en el teléfono.

Importante: los datos viven en el navegador de cada teléfono. Exporta o envía el respaldo a Drive al terminar cada jornada.

## 3. Conectar las fotos con Drive

Carpeta de destino: https://drive.google.com/drive/folders/1DVhVQYuH-3z_SpyECU_i74dEsd6C10xM

1. Entra a https://script.google.com con la cuenta dueña de la carpeta › **Nuevo proyecto**.
2. Borra el contenido y pega `apps-script/Code.gs`.
3. Cambia `CAMBIA-ESTA-CLAVE` por una clave propia.
4. **Implementar › Nueva implementación › Tipo: Aplicación web**.
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquier usuario**.
5. Autoriza los permisos de Drive y copia la URL que termina en `/exec`.
6. En el cuestionario: **Menú › Fotos y envío a Drive › Conexión con Drive**, pega la URL y la clave, y pulsa **Guardar y probar conexión**.

Estructura que se crea en Drive al enviar la primera foto de cada playa:

```
<Carpeta raíz>/
  11. La Roqueta-Playa Las Palmitas/
    001 Acceso público/
    002 Estacionamiento/
    … (46 carpetas, una por ítem)
    Otras/
  _Registros/            respaldos de datos (JSON)
```

Nombre de cada foto: `P11_I001_MAT_20261124-130512_1.jpg` (playa, ítem, turno, fecha-hora, consecutivo). El comentario de cada foto queda en la descripción del archivo en Drive.

Opcional: para crear de una vez las carpetas de las 50 playas, ejecuta `crearEstructuraCompleta` desde el editor de Apps Script.

## 4. Imágenes de referencia por ítem

La carpeta `img/` ya incluye 28 imágenes (`item-NNN.jpg`, número del ítem a tres dígitos); `img/LEEME.txt` lista las 18 pendientes. Si no existe, el cuestionario muestra el espacio «Imagen de referencia por cargar».

## 5. Exportación

En **Registros y exportación**:

- `Caracterizacion_Playas_<fecha>.xlsx`: un libro con las hojas Matriz_Turno, BD_A, Percepción, Fotos y Recorrido GPS.
- KML con los recorridos y las fotos georreferenciadas de todas las playas.
- Respaldo completo (JSON), que puede importarse en otro teléfono para unir la información.
- CSV por hoja, en «Otros formatos».

## 6. Recorrido GPS y coordenadas de fotos

- **Recorrido GPS** (botón en la barra superior): graba el recorrido de la playa con el GPS del teléfono, sin necesidad de internet. Mientras graba, la pantalla se mantiene encendida; deja el cuestionario abierto para que el teléfono no suspenda el GPS.
- Cada pausa y reanudación genera un tramo nuevo. El recorrido se ve en un mapa (el fondo de mapa requiere internet) y se descarga en **KML** o se envía a la carpeta de la playa en Drive.
- Cada foto guarda su nombre de archivo y la coordenada del teléfono al tomarla o cargarla (o el último punto del recorrido si el GPS no responde). En Drive, la coordenada queda en la descripción del archivo.
- El Excel de **Registros y exportación** incluye las hojas Matriz_Turno, BD_A, Percepción, Fotos (nombre, coordenada, precisión, comentario) y Recorrido GPS (todos los puntos).
