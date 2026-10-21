# Especificación MVP — Job Tracker

## Contexto y objetivo

Job Tracker permite a una persona registrar y administrar sus postulaciones laborales en un único lugar. El MVP debe facilitar crear, consultar, editar, eliminar y actualizar el estado de cada postulación, conservando los cambios en el navegador.

## Usuarios

Persona que busca empleo y necesita seguir sus propias postulaciones.

## Historias de usuario

- Como persona candidata, quiero registrar una postulación para no perder su información esencial.
- Como persona candidata, quiero actualizar sus datos, notas y estado para reflejar mi avance.
- Como persona candidata, quiero listar, filtrar y ordenar postulaciones para priorizar mi seguimiento.
- Como persona candidata, quiero eliminar una postulación errónea para mantener mi listado confiable.

## Requisitos funcionales

- **RF-1 — Crear postulación.** Cuando la persona guarde datos válidos, el sistema deberá crear una postulación con puesto obligatorio, empresa opcional, fecha de postulación obligatoria, estado y una nota opcional editable. El estado inicial deberá ser “Postulado” y se podrán elegir “En proceso”, “Oferta” o “Rechazado”.
- **RF-2 — Validar datos.** Si puesto, fecha o estado no son válidos, el sistema deberá mostrar el mensaje de error en español junto al campo afectado y no deberá guardar. Si la fecha es posterior a hoy, el sistema deberá rechazarla.
- **RF-3 — Normalizar textos.** Cuando se guarde o edite una postulación, el sistema deberá quitar espacios al inicio y al final; los campos opcionales que queden vacíos se deberán considerar ausentes.
- **RF-4 — Evitar duplicados.** Si ya existe una postulación con el mismo puesto, empresa y fecha —sin distinguir mayúsculas ni espacios exteriores—, el sistema deberá impedir crearla o editarla y deberá informar el motivo.
- **RF-5 — Listar y ordenar.** Cuando se visualice el listado sin otro orden elegido, el sistema deberá mostrar primero las fechas más recientes. Cuando la persona seleccione fecha, puesto o empresa y una dirección, el sistema deberá ordenar ascendente o descendentemente; las postulaciones sin empresa deberán quedar siempre al final.
- **RF-6 — Filtrar por estado.** Cuando la persona seleccione un estado, el sistema deberá mostrar únicamente las postulaciones de ese estado. Cuando retire el filtro, el sistema deberá volver a mostrar todas.
- **RF-7 — Editar y cambiar estado.** Cuando la persona actualice una postulación válida, el sistema deberá reflejar y conservar los cambios inmediatamente. Cuando seleccione cualquiera de los cuatro estados, el sistema deberá permitir el cambio desde cualquier estado previo.
- **RF-8 — Eliminar.** Cuando la persona solicite eliminar una postulación, el sistema deberá pedir confirmación. Si confirma, deberá eliminarla definitivamente; si cancela, deberá conservarla sin cambios.
- **RF-9 — Estados sin resultados.** Cuando no existan postulaciones, el sistema deberá mostrar un mensaje contextual y una acción para crear una. Cuando un filtro no tenga coincidencias, deberá explicar el resultado y ofrecer limpiar el filtro.
- **RF-10 — Persistencia y errores.** Cuando una operación se complete correctamente, el sistema deberá conservar el cambio tras recargar o cerrar el navegador. Mientras no pueda leer o guardar los datos, deberá informar el problema, preservar los datos disponibles y no confirmar como exitosa una operación no guardada.

## Requisitos no funcionales

- La interfaz, validaciones y mensajes para la persona usuaria estarán en español; el código, identificadores y comentarios técnicos estarán en inglés.
- La experiencia deberá ser clara, usable, responsive y accesible mediante teclado.
- Los textos de puesto, empresa y nota no tendrán límite de caracteres; puesto no podrá ser solo espacios, y empresa o nota vacías serán válidas.
- Para valores equivalentes al ordenar, se conservará el orden relativo existente.

## Casos límite

- La fecha solo representa un día de calendario, sin hora ni zona horaria.
- Se aceptan fechas pasadas y la fecha actual, nunca futuras.
- Una empresa ausente participa en la detección de duplicados como valor vacío.
- Una edición que cree un duplicado deberá rechazarse sin alterar el registro existente.
- Los cambios de estado no tendrán restricciones, incluso desde “Oferta” o “Rechazado”.

## Fuera de alcance

- Contactos, adjuntos, recordatorios, analítica, búsqueda de texto, importación/exportación, cuentas y sincronización entre dispositivos.
- Historial de notas: cada postulación solo tendrá una nota editable.

## Criterios de finalización

- Todos los RF y sus criterios de aceptación están cubiertos.
- Existen pruebas automatizadas para creación, validación, duplicados, edición, eliminación, filtros, orden, cambios de estado y persistencia.
- La interfaz comunica errores y estados vacíos en español.

## Dudas abiertas

- No hay dudas abiertas.
