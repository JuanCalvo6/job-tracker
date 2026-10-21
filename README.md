# Job Tracker

Job Tracker is a responsive single-page application for recording and managing job applications in one place. It is an educational project built to practice React, TypeScript, automated testing, and Specification-Driven Development (SDD) through a complete MVP.

The interface is written in Spanish, while the source code, identifiers, and technical documentation are written in English.

## Features

- Create applications with a position, company, application date, status, and optional note.
- Edit existing applications and delete them after confirmation.
- Move an application between Applied, In progress, Offer, and Rejected.
- Filter applications by status.
- Sort applications by date, position, or company in either direction.
- Validate required fields, reject future dates, normalize text, and prevent duplicates.
- Keep data in the browser and report storage failures without presenting unsaved changes as successful.
- Support responsive layouts and keyboard navigation.

## How to use it

1. Select the primary new-application action to open the creation form.
2. Enter the position and application date, then add a company, status, or note when needed.
3. Use the controls above the results to filter or reorder the list.
4. Select the current status on a card to move the application to another stage.
5. Hover over or focus an application to reveal its edit and delete actions.
6. Confirm a deletion to remove an application permanently.

All application data is stored in `localStorage`. It is available only in the current browser on the current device, is not synchronized elsewhere, and will be lost if the site's local data is cleared.

## Tech stack

- **React 19** builds the component-based user interface and manages local UI state.
- **TypeScript 5** defines the domain and command contracts with strict type checking.
- **Vite** provides the local development server and production build pipeline.
- **Tailwind CSS** provides responsive, utility-based styling without a component library.
- **Vitest** runs unit and component tests.
- **React Testing Library** verifies behavior through user-facing interactions and accessible queries.
- **ESLint** enforces static code-quality rules.
- **localStorage** provides browser-only persistence through a versioned repository format.

## Getting started

### Requirements

- Node.js
- npm

### Install and run

```bash
npm install
npm run dev
```

Vite will print the local URL where the application is available.

### Quality checks

```bash
npm run test -- --run
npm run lint
npm run build
```

The test command runs the project setup checks followed by the Vitest suite. The build command performs TypeScript validation before creating the production bundle.

## Technical design

Job Tracker is a client-only SPA. It has no backend, user accounts, authentication, cloud storage, telemetry, or external API integration.

The code separates responsibilities into four areas:

- **Domain:** application types, normalization, validation, duplicate detection, filtering, and sorting.
- **Application service:** typed commands for loading, creating, updating, changing status, and deleting applications.
- **Infrastructure:** a versioned repository that reads from and writes to `localStorage`.
- **Interface:** React components that collect input, present results, and communicate command outcomes.

The main data flow is:

```text
UI → typed command → validation → persistence → UI update
```

Commands return typed result objects with internal exit codes. A successful mutation is reflected in the visible state only after the repository confirms that it was saved. Invalid or unreadable stored data is reported without being overwritten.

## Development with SDD

Specification-Driven Development treats explicit, reviewable requirements as the source of truth for implementation. In this project, each stage reduced ambiguity before code was changed and kept the final behavior traceable to the original requirements.

The workflow used was:

```text
AGENT.md → constitution.md → spec.md → plan.md → tasks.md → tests → implementation
```

Each stage had a distinct responsibility:

1. [`AGENT.md`](AGENT.md) established the project context, commands, conventions, boundaries, and completion rules for the development agent.
2. The [project constitution](docs/constitution.md) defined the non-negotiable principles that every specification, plan, task, and implementation had to respect.
3. The [MVP specification](specs/001-JobTracker-mvp/spec.md) described the problem, users, user stories, functional requirements, acceptance criteria, edge cases, and exclusions.
4. The [technical plan](specs/001-JobTracker-mvp/plan.md) translated those requirements into modules, data contracts, algorithms, technical decisions, and testing strategies.
5. The [task list](specs/001-JobTracker-mvp/tasks.md) divided the work into dependency-ordered tasks designed to take approximately 20–30 minutes each, with a verifiable definition of done.
6. Tests were written before the corresponding implementation to define the expected behavior and expose regressions.
7. Implementation followed the approved documents and was accepted only after its tests and mandatory quality checks passed.

The specification labels its functional requirements as RF-1 through RF-10. Those identifiers are carried into the technical plan and task list, making it possible to trace each implementation task back to a documented product requirement.

## Testing and quality

The automated suite covers:

- Domain normalization, validation, status definitions, and duplicate detection.
- Stable filtering and sorting, including applications without a company.
- Repository loading, versioned persistence, invalid stored data, and read/write failures.
- Application commands and the rule that in-memory data changes only after successful persistence.
- Component and user flows for creation, validation, editing, status changes, filtering, sorting, deletion, empty states, and persistence across reloads.

A task is considered complete only when its relevant behavior is tested and all three checks pass:

```bash
npm run lint
npm run test -- --run
npm run build
```

## Decisions, limitations, and lessons learned

The MVP intentionally avoids a backend, router, global state library, UI component library, icon package, and drag-and-drop dependency. The application has a single local workspace, so React state and focused modules are sufficient while keeping the project approachable for a junior developer.

Current limitations include:

- No accounts or authentication.
- No synchronization between browsers or devices.
- No import or export workflow.
- No attachments, contacts, reminders, analytics, or text search.
- No change history or note history.

The main lessons from the project were how to turn an initial idea into verifiable requirements, preserve traceability from specification to implementation, keep domain logic separate from the interface, and make progress through small tasks with tests and explicit completion criteria.

## Project status

The educational MVP is complete and covers RF-1 through RF-10. Future work should begin by updating the relevant specification, then the technical plan and task list, so that new behavior preserves the same SDD traceability and quality rules.

## License

This project is distributed under the [MIT License](LICENSE).
