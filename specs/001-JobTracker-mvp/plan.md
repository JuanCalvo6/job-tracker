# Plan técnico — MVP Job Tracker

## Resumen

Crear un plan técnico que use únicamente React, TypeScript, Tailwind, Vitest y React Testing Library. La lógica de dominio y persistencia quedará fuera de la interfaz; todos los comandos de la aplicación devolverán resultados tipados con código de salida interno.

## Estructura de módulos

- `domain/application`: modelo, normalización, validación, detección de duplicados y selectores de filtro/orden. **RF-1 a RF-7**.
- `infrastructure/applicationRepository`: lectura y escritura versionada de datos locales, sin sobrescribir datos dañados ni confirmar escrituras fallidas. **RF-10**.
- `application/useApplications`: orquestación de carga, comandos, estados de error y actualización de la vista solo tras persistencia exitosa. **RF-1, RF-4, RF-7, RF-8, RF-10**.
- `components`: formulario, controles de orden/filtro, listado, tarjeta de postulación, confirmación de eliminación y estados vacíos/error. **RF-1, RF-2, RF-5 a RF-9**.
- `tests`: pruebas unitarias de dominio, repositorio y comandos; pruebas de componentes para los recorridos de usuario. **RF-1 a RF-10**.

## Modelo de datos

```text
JobApplication
- id: string UUID
- position: string
- company?: string
- applicationDate: string (YYYY-MM-DD)
- status: "applied" | "in_progress" | "offer" | "rejected"
- note?: string
- createdAt: string ISO-8601
```

Ejemplo:

```json
{
  "id": "bd92f8c0-1b7d-4dfe-b1ee-4b451792cf7c",
  "position": "Desarrollador Frontend",
  "company": "Acme",
  "applicationDate": "2026-10-13",
  "status": "applied",
  "note": "Enviar seguimiento la próxima semana.",
  "createdAt": "2026-10-13T15:30:00.000Z"
}
```

Los valores internos estarán en inglés y la interfaz los traducirá a español. La ausencia de empresa o nota se representará sin valor; la colección conservará el orden de creación para resolver empates estables. **RF-1, RF-3, RF-5, RF-7**.

## Algoritmos y contratos de acciones

| Acción | Entrada | Salida exitosa | Códigos de salida | RF |
|---|---|---|---|---|
| `loadApplications` | Ninguna | Lista persistida o lista vacía | `0` éxito, `4` error de lectura, `6` datos inválidos | RF-5, RF-9, RF-10 |
| `createApplication` | Datos del formulario | Postulación creada | `0` éxito, `1` validación, `2` duplicado, `5` error de escritura | RF-1 a RF-4, RF-10 |
| `updateApplication` | ID y datos actualizados | Postulación actualizada | `0`, `1`, `2`, `3` no encontrada, `5` | RF-2 a RF-4, RF-7, RF-10 |
| `changeApplicationStatus` | ID y estado | Postulación actualizada | `0`, `1`, `3`, `5` | RF-2, RF-7, RF-10 |
| `deleteApplication` | ID confirmado | Sin contenido | `0`, `3`, `5` | RF-8, RF-10 |
| `selectApplications` | Lista, filtro y orden | Lista visible ordenada | `0` | RF-5, RF-6, RF-9 |

- Cada resultado fallido incluirá un mensaje de interfaz en español y, para validación, errores por campo.
- Normalizar textos antes de validar: recortar extremos; empresa y nota vacías pasan a estar ausentes.
- Validar puesto no vacío, fecha válida no futura y estado permitido.
- Comparar duplicados por puesto, empresa y fecha normalizados, sin distinguir mayúsculas, excluyendo el propio ID al editar.
- Filtrar por un único estado antes de ordenar una copia de la lista; ordenar por fecha, puesto o empresa y mantener empresas ausentes al final.
- Persistir antes de actualizar el estado visible. Ante datos almacenados inválidos o una lectura fallida, no sobrescribir el contenido existente y presentar el error. **RF-2 a RF-7, RF-10**.

## Decisiones técnicas

- Usar estado local de React coordinado por un hook de aplicación, en lugar de estado global: el alcance es una sola pantalla y evita dependencias adicionales. Se descartan Redux, Zustand y Context global.
- Usar un repositorio local versionado con una única clave de almacenamiento: simplifica persistencia y permite validar la forma de los datos. Se descartan backend, APIs externas, cuentas y sincronización por constitución.
- Usar formularios controlados y validación al intentar guardar, con corrección inmediata de campos ya invalidados: ofrece mensajes precisos y mantiene el dominio independiente de componentes.
- Usar la confirmación nativa del navegador para eliminaciones: cubre la confirmación obligatoria sin incorporar una librería ni un sistema de diálogos adicional. Se descartan librerías de UI y modales externos.
- Representar fechas como día `YYYY-MM-DD`, sin hora ni zona horaria, para impedir conversiones de fecha. **RF-1, RF-2, RF-8, RF-10**.

## Estrategia de pruebas

- **Dominio:** normalización, validación de fecha y textos, mapeo de estados, detección de duplicados, edición que colisiona y orden estable. **RF-1 a RF-7**.
- **Selectores:** orden predeterminado, ambas direcciones, empresa vacía al final y filtro de un único estado. **RF-5, RF-6, RF-9**.
- **Repositorio:** carga vacía, carga válida tras recarga, datos inválidos, errores de lectura y errores de escritura sin alterar estado confirmado. **RF-10**.
- **Componentes:** creación válida e inválida, errores por campo en español, edición, transición entre cualquiera de los estados, confirmación/cancelación de borrado y mensajes de listado vacío o filtro sin resultados. **RF-1 a RF-9**.
- Ejecutar lint, pruebas no interactivas y build al completar cada cambio, conforme a la constitución.

## Supuestos

- Los códigos de salida son valores internos de las acciones de la aplicación, no códigos de proceso del sistema.
- Las fechas se comparan contra el día local del navegador.
- La confirmación de eliminación es definitiva y no hay papelera ni deshacer.
