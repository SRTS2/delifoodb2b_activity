# Estrategia de Control de Versiones

Para este MVP, utilizaremos una estrategia basada en **GitHub Flow**, adaptada para mantener la simplicidad y la velocidad durante el taller.

## 1. Ramas Principales
* `main`: Es la rama principal y está protegida. Contiene el código de producción funcional y estable. Nunca se sube código directamente a esta rama (No commits directos).

## 2. Ramas de Características (Feature Branches)
Cada miembro del equipo trabajará en ramas temporales y de corta duración, creadas a partir de `main`. La nomenclatura será:
* `feat-frontend`: Para todos los cambios relacionados con la interfaz de usuario.
* `feat-backend`: Para la creación de la API y la persistencia en memoria.

## 3. Flujo de Trabajo
1.  **Clonar y crear rama:** Un desarrollador se posiciona en `main`, actualiza (`git pull`) y crea su rama de trabajo (`git checkout -b feat-backend`).
2.  **Desarrollo local:** Realiza los commits necesarios (`git add .`, `git commit -m "feat: implementa endpoint de login"`).
3.  **Subir rama:** Sube la rama al repositorio remoto (`git push origin feat-backend`).
4.  **Pull Request (PR):** Abre un Pull Request en GitHub hacia la rama `main`.
5.  **Revisión e Integración:** Otro miembro del equipo revisa el código. Si no hay conflictos, se aprueba y se hace el *merge* a `main`.