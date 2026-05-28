const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- PERSISTENCIA EN MEMORIA ---
// Usuarios de prueba fijos (RF1)
const usuariosDb = [
    { username: 'cliente1', password: '123', rol: 'cliente' },
    { username: 'admin1', password: 'admin', rol: 'administrador' }
];

// Arreglo global para guardar pedidos (RF2)
let pedidosDb = [];
let contadorId = 1;

// --- ENDPOINTS ---

// 1. Autenticación Simulada (Mocked Login)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    const usuario = usuariosDb.find(u => u.username === username && u.password === password);
    
    if (usuario) {
        res.json({ mensaje: 'Login exitoso', username: usuario.username, rol: usuario.rol });
    } else {
        res.status(401).json({ error: 'Credenciales inválidas' });
    }
});

// 2. Crear un Pedido (Solo clientes)
app.post('/api/pedidos', (req, res) => {
    const { restaurante, producto, cantidad, username } = req.body;

    if (!restaurante || !producto || !cantidad || !username) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const nuevoPedido = {
        id: contadorId++,
        restaurante,
        producto,
        cantidad,
        estado: 'Pendiente', // Estado inicial por defecto
        cliente: username
    };

    pedidosDb.push(nuevoPedido);
    res.status(201).json({ mensaje: 'Pedido creado exitosamente', pedido: nuevoPedido });
});

// 3. Leer Pedidos (Admin ve todos, Cliente ve los suyos)
app.get('/api/pedidos', (req, res) => {
    const { username, rol } = req.query; // Recibimos los datos del usuario que consulta

    if (rol === 'administrador') {
        return res.json(pedidosDb); // Admin ve todo
    } else if (rol === 'cliente') {
        const misPedidos = pedidosDb.filter(p => p.cliente === username);
        return res.json(misPedidos); // Cliente ve solo los suyos
    } else {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
});

// 4. Actualizar Estado del Pedido (Solo Administrador)
app.put('/api/pedidos/:id', (req, res) => {
    const idPedido = parseInt(req.params.id);
    const { nuevoEstado, rol } = req.body;

    if (rol !== 'administrador') {
        return res.status(403).json({ error: 'Solo los administradores pueden cambiar estados' });
    }

    const pedido = pedidosDb.find(p => p.id === idPedido);

    if (pedido) {
        pedido.estado = nuevoEstado;
        res.json({ mensaje: 'Estado actualizado correctamente', pedido });
    } else {
        res.status(404).json({ error: 'Pedido no encontrado' });
    }
});

// --- INICIAR SERVIDOR ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor Backend de Delifood corriendo en http://localhost:${PORT}`);
});