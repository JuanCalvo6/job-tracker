# Constitución — Job Tracker

Principios innegociables. Todo spec, plan, tarea, revisión debe cumplirlos. 

1. Usar solo Vite, React, TypeScript, Tailwind, Vitest y React Testing Library; toda dependencia nueva requiere aprobación.
2. Leer la spec activa y esta constitución antes de codificar; cada cambio debe trazar un requisito documentado.
3. Mantener la lógica de dominio, persistencia y cálculos fuera de los componentes de interfaz.
4. Cada comportamiento nuevo o modificado debe incluir pruebas unitarias o de componente.
5. Todo cambio debe superar `npm run lint`, `npm run test -- --run` y `npm run build`.
6. Persistir postulaciones solo en `localStorage`; quedan prohibidos backend, APIs externas, autenticación y almacenamiento cloud.
7. Usar TypeScript estricto y evitar `any`; los tipos deben describir explícitamente el dominio.
8. Escribir código, identificadores y comentarios técnicos en inglés; interfaz y mensajes al usuario en español.
