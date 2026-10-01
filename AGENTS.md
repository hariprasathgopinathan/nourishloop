# AGENTS.md — Project Rules for Surplus Food Donation Network

## Language & Framework Rules

- Use **JavaScript** for both frontend and backend code.
- Frontend: React + Vite + JavaScript + Tailwind CSS.
- Backend: Node.js + Express.js + JavaScript.
- Database: MongoDB with Mongoose ODM.

## Development Practices

- **Prefer small, incremental changes.** Each change should be focused and reviewable.
- **Do not rewrite the entire project unnecessarily.** Modify only what is needed to accomplish the task.
- **Do not modify unrelated files.** Keep changes scoped to the feature or fix being worked on.
- **Do not implement future features before they are requested.** Build only what is asked for in the current step.
- **Do not install unnecessary dependencies.** Every added package must have a clear justification.
- **Follow the existing project architecture.** New code should be consistent with established patterns and conventions.

## Security Rules

- **Never hardcode secrets or API keys** in source code, configuration files, or documentation.
- **Use environment variables** for all secrets, API keys, database URIs, and sensitive configuration.
- Store environment variable templates in `.env.example` files (without actual values).
- Add all `.env` files to `.gitignore`.

## Documentation & Communication

- **Explain important architectural decisions** when introducing new patterns or making structural changes.
- Document non-obvious design choices with inline comments or in the `docs/` directory.

## Validation & Quality

- **After implementation, run appropriate validation/build/test checks** to verify correctness.
- Ensure the project builds and runs without errors before considering a step complete.
- Follow consistent code formatting and linting rules.

## File & Folder Conventions

- Frontend code lives in `frontend/`.
- Backend code lives in `backend/`.
- Project documentation lives in `docs/`.
- Shared constants or contracts (if needed later) should be clearly organized and documented.
