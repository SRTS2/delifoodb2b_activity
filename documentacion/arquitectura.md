# Arquitectura del Sistema - MVP Delifood

## 1. Selección de Tecnologías

Para cumplir con el desarrollo del MVP en el tiempo establecido (4 horas), el equipo ha seleccionado el siguiente stack tecnológico:

* **Backend:** Node.js con Express. Justificación: Permite un desarrollo ágil, sintaxis minimalista y manejo nativo de objetos JSON para la API REST.
* **Frontend:** Vanilla JS (HTML/CSS/JS) con Tailwind CSS vía CDN. Justificación: Cero configuración inicial. Evita la complejidad de compilar o empaquetar código, facilitando el desarrollo rápido de las vistas (Login, Cliente, Administrador).
* **Persistencia:** Memoria RAM (Estructuras de datos en el servidor). Justificación: Elimina la fricción de configurar y conectar motores de bases de datos, permitiendo enfocarse en la lógica de negocio y la comunicación cliente-servidor.

## 2. Diagrama de Arquitectura

El sistema sigue una arquitectura Cliente-Servidor separada y comunicada mediante HTTP.

```mermaid
sequenceDiagram
    participant F as Frontend (Cliente/Admin)
    participant B as Backend (API Express)
    participant M as Memoria (Arrays RAM)
    
    F->>B: POST /api/login (Credenciales)
    B-->>F: Respuesta (Rol: Cliente o Admin)
    
    F->>B: POST /api/pedidos (Crear pedido)
    B->>M: Guarda pedido en array
    B-->>F: Confirmación de creación
    
    F->>B: GET /api/pedidos (Listar)
    M-->>B: Retorna datos
    B-->>F: JSON con pedidos
    
    F->>B: PUT /api/pedidos/:id (Cambiar estado)
    B->>M: Actualiza estado en array
    B-->>F: Confirmación de actualización