const API_URL = 'http://localhost:3000/api';

// Estado global de la aplicación
let usuarioActual = null;

// --- FUNCIONES DE AUTENTICACIÓN ---

async function login() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    try {
        const respuesta = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });

        if (respuesta.ok) {
            const data = await respuesta.json();
            usuarioActual = data;
            document.getElementById('login-error').classList.add('hidden');
            mostrarVistaCorrespondiente();
        } else {
            document.getElementById('login-error').classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        alert('Error de conexión. ¿Está el backend encendido?');
    }
}

function logout() {
    usuarioActual = null;
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    // Ocultar todas las vistas y mostrar el login
    document.getElementById('vista-cliente').classList.add('hidden');
    document.getElementById('vista-admin').classList.add('hidden');
    document.getElementById('vista-login').classList.remove('hidden');
}

// --- FUNCIONES DE NAVEGACIÓN ---

function mostrarVistaCorrespondiente() {
    document.getElementById('vista-login').classList.add('hidden');

    if (usuarioActual.rol === 'cliente') {
        document.getElementById('vista-cliente').classList.remove('hidden');
        cargarPedidos();
    } else if (usuarioActual.rol === 'administrador') {
        document.getElementById('vista-admin').classList.remove('hidden');
        cargarPedidos();
    }
}

// --- FUNCIONES DE GESTIÓN DE PEDIDOS ---

async function crearPedido() {
    const restaurante = document.getElementById('restaurante').value;
    const producto = document.getElementById('producto').value;
    const cantidad = document.getElementById('cantidad').value;

    if (!restaurante || !producto || !cantidad) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const nuevoPedido = {
        restaurante,
        producto,
        cantidad: parseInt(cantidad),
        username: usuarioActual.username
    };

    await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoPedido)
    });

    // Limpiar campos y recargar la lista
    document.getElementById('restaurante').value = '';
    document.getElementById('producto').value = '';
    document.getElementById('cantidad').value = '';
    cargarPedidos();
}

async function cargarPedidos() {
    const respuesta = await fetch(`${API_URL}/pedidos?username=${usuarioActual.username}&rol=${usuarioActual.rol}`);
    const pedidos = await respuesta.json();

    if (usuarioActual.rol === 'cliente') {
        renderizarListaCliente(pedidos);
    } else {
        renderizarTablaAdmin(pedidos);
    }
}

async function cambiarEstado(id) {
    // Alternamos entre 'Pendiente' y 'Preparado' por simplicidad
    const nuevoEstado = 'Preparado';

    await fetch(`${API_URL}/pedidos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevoEstado, rol: usuarioActual.rol })
    });

    cargarPedidos(); // Refrescar la vista
}

// --- FUNCIONES DE RENDERIZADO (UI) ---

function renderizarListaCliente(pedidos) {
    const ul = document.getElementById('lista-pedidos-cliente');
    ul.innerHTML = '';
    
    if (pedidos.length === 0) {
        ul.innerHTML = '<p class="text-gray-500 py-2">No tienes pedidos aún.</p>';
        return;
    }

    pedidos.forEach(p => {
        ul.innerHTML += `
            <li class="py-3 flex justify-between">
                <div>
                    <span class="font-bold">${p.cantidad}x ${p.producto}</span> en ${p.restaurante}
                </div>
                <span class="px-2 py-1 bg-gray-200 rounded text-sm">${p.estado}</span>
            </li>
        `;
    });
}

function renderizarTablaAdmin(pedidos) {
    const tbody = document.getElementById('tabla-pedidos-admin');
    tbody.innerHTML = '';

    pedidos.forEach(p => {
        let btnAccion = p.estado === 'Pendiente' 
            ? `<button onclick="cambiarEstado(${p.id})" class="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Marcar Preparado</button>`
            : `<span class="text-xs text-green-600 font-bold">Completado</span>`;

        tbody.innerHTML += `
            <tr class="border-b">
                <td class="p-2">${p.id}</td>
                <td class="p-2">${p.cliente}</td>
                <td class="p-2">${p.restaurante}</td>
                <td class="p-2">${p.producto}</td>
                <td class="p-2">${p.cantidad}</td>
                <td class="p-2 font-semibold ${p.estado === 'Pendiente' ? 'text-orange-500' : 'text-green-500'}">${p.estado}</td>
                <td class="p-2">${btnAccion}</td>
            </tr>
        `;
    });
}