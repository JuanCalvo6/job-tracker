# Tareas — MVP Job Tracker

## Resumen

Las tareas están ordenadas por dependencia. Cada una está acotada a 20–30 minutos y mantiene trazabilidad con los RF.

- [x] **T01 — Inicializar el proyecto y scripts base** *(20 min)*  
  **RF:** Base para todos los RF.  
  **Hecho cuando:** Vite, React, TypeScript estricto y los comandos `dev`, `build` y `lint` existen y ejecutan correctamente.

- [x] **T02 — Configurar Tailwind y el entorno de pruebas** *(25 min)*  
  **RF:** Base para todos los RF.  
  **Hecho cuando:** Tailwind procesa estilos y Vitest con React Testing Library ejecuta una prueba inicial.

- [x] **T03 — Definir modelo de datos y etiquetas de estado** *(20 min)*  
  **RF:** RF-1, RF-7.  
  **Hecho cuando:** Los tipos describen una postulación, los cuatro estados internos y sus etiquetas en español.

- [x] **T04 — Implementar normalización y validación de datos** *(30 min)*  
  **RF:** RF-2, RF-3.  
  **Hecho cuando:** Pruebas unitarias cubren espacios, puesto vacío, campos opcionales vacíos, fecha inválida/futura y estado inválido.

- [x] **T05 — Implementar detección de duplicados** *(20 min)*  
  **RF:** RF-4.  
  **Hecho cuando:** Las pruebas confirman que se bloquean coincidencias por puesto, empresa y fecha sin distinguir mayúsculas ni espacios, incluyendo edición.

- [x] **T06 — Implementar selectores de filtro y orden** *(30 min)*  
  **RF:** RF-5, RF-6, RF-9.  
  **Hecho cuando:** Las pruebas cubren orden predeterminado, ambos sentidos, empresa ausente al final, filtro único y lista sin coincidencias.

- [x] **T07 — Implementar repositorio de persistencia local** *(30 min)*  
  **RF:** RF-10.  
  **Hecho cuando:** Las pruebas cubren carga vacía, carga válida, datos inválidos y fallos de lectura/escritura sin sobrescribir datos.

- [x] **T08 — Implementar comandos de aplicación y códigos de salida** *(30 min)*  
  **RF:** RF-1 a RF-8, RF-10.  
  **Hecho cuando:** Crear, editar, cambiar estado, eliminar y cargar devuelven los códigos definidos y solo actualizan datos tras persistir correctamente.

- [x] **T09 — Crear la estructura visual principal** *(20 min)*  
  **RF:** Base para RF-1, RF-5 y RF-9.  
  **Hecho cuando:** La pantalla presenta encabezado, zona de creación, controles y zona de resultados en un diseño responsive.

- [x] **T10 — Crear el formulario de nueva postulación** *(30 min)*  
  **RF:** RF-1.  
  **Hecho cuando:** El formulario incluye puesto, empresa, fecha, estado “Postulado” por defecto y nota opcional, con etiquetas en español.

- [x] **T11 — Mostrar validaciones y errores de duplicado en el formulario** *(25 min)*  
  **RF:** RF-2, RF-3, RF-4.  
  **Hecho cuando:** Cada error aparece junto a su campo, bloquea el guardado y el error de duplicado se comunica en español.

- [x] **T12 — Renderizar el listado de postulaciones** *(25 min)*  
  **RF:** RF-5.  
  **Hecho cuando:** Cada postulación muestra puesto, empresa si existe, fecha, estado y nota si existe; el orden inicial es por fecha descendente.

- [x] **T13 — Añadir controles de orden y filtro** *(25 min)*  
  **RF:** RF-5, RF-6.  
  **Hecho cuando:** Se puede elegir campo y dirección de orden, filtrar por un único estado y restablecer la vista completa.

- [x] **T14 — Implementar estados vacíos y sin coincidencias** *(20 min)*  
  **RF:** RF-9.  
  **Hecho cuando:** El listado vacío ofrece crear una postulación y un filtro sin resultados ofrece limpiarlo.

- [x] **T15 — Implementar edición de postulaciones** *(30 min)*  
  **RF:** RF-2, RF-3, RF-4, RF-7.  
  **Hecho cuando:** Una postulación puede abrirse con sus valores actuales, validarse y actualizarse sin aceptar duplicados.

- [x] **T16 — Implementar cambio de estado** *(20 min)*  
  **RF:** RF-7.  
  **Hecho cuando:** Cualquier postulación puede pasar entre los cuatro estados y el cambio permanece tras recargar.

- [x] **T17 — Implementar eliminación confirmada** *(20 min)*  
  **RF:** RF-8.  
  **Hecho cuando:** Cancelar conserva la postulación y confirmar la elimina definitivamente.

- [x] **T18 — Mostrar errores de persistencia** *(25 min)*  
  **RF:** RF-10.  
  **Hecho cuando:** Un fallo de carga o guardado muestra un aviso en español y no presenta como exitoso un cambio no persistido.

- [x] **T19 — Completar pruebas de componentes y recorridos críticos** *(30 min)*  
  **RF:** RF-1 a RF-10.  
  **Hecho cuando:** Las pruebas cubren crear, validar, editar, filtrar, ordenar, cambiar estado, eliminar, estados vacíos y persistencia.

- [x] **T20 — Ejecutar la verificación final** *(20 min)*  
  **RF:** RF-1 a RF-10.  
  **Hecho cuando:** `npm run lint`, `npm run test -- --run` y `npm run build` terminan correctamente.
