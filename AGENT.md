# Guía de desarrollo — Job Tracker

## Proyecto

Job Tracker es una aplicación web para registrar y seguir postulaciones de empleo de forma rápida, cómoda y visual.

La aplicación es una SPA local: los datos se almacenan únicamente en el navegador mediante `localStorage`.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
npm run test
npm run test -- --run
```

Usa `npm run test -- --run` para ejecutar las pruebas una vez en validaciones no interactivas.

## Estilo y convenciones

- Vite, React 19, TypeScript 5.x, Tailwind CSS, Vitest y React Testing Library.
- Usa TypeScript en modo estricto. Evita `any`; define tipos explícitos y reutilizables cuando sea necesario.
- Nombra componentes y tipos con `PascalCase`; funciones, variables y props con `camelCase`; constantes globales con `UPPER_SNAKE_CASE`.
- Escribe código, identificadores, tipos y comentarios técnicos en inglés.
- Escribe los textos visibles en la interfaz, los mensajes de validación y la documentación de producto en español.
- Mantén los componentes pequeños y enfocados. Extrae lógica reutilizable a hooks o utilidades antes de duplicarla.
- Organiza las clases de Tailwind de forma legible y consistente; prioriza estilos responsive y accesibles.

## Reglas

- Lee docs/constitution.md y la spec activa antes de tocar código.
- Modifica solo código de la aplicación, su configuración mínima, sus pruebas y la documentación relacionada.
- Conserva los datos exclusivamente en `localStorage`. No añadas backend, autenticación, APIs externas, telemetría ni almacenamiento en la nube.
- No añadas dependencias sin consultar antes, incluidos router, librerías de componentes, paquetes de iconos, estado global o drag-and-drop.
- Mantén una interfaz rápida, limpia, profesional, accesible y responsive.
- No implementes funcionalidades ajenas al seguimiento de postulaciones sin aprobación previa.

## Al terminar cualquier tarea

- Ejecuta obligatoriamente `npm run lint`, `npm run test -- --run` y `npm run build`.
- Añade o actualiza pruebas para cada cambio de comportamiento. Da especial cobertura a la persistencia local, creación y edición de postulaciones, filtros, orden y transiciones entre estados.
- Informa los archivos modificados, los comandos de verificación ejecutados y cualquier verificación pendiente.

## Supuestos iniciales

- El proyecto se inicializa con Vite, React y TypeScript.
- La interfaz está en español y el código está en inglés.
- Las pruebas son unitarias y de componentes con Vitest y React Testing Library; las pruebas E2E no se incluyen inicialmente.
