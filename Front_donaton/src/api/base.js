import axios from "axios";

// Instancia para Logística (Puerto 3001)
export const logisticaApi = axios.create({
    baseURL: 'https://wg68k7qz-8080.brs.devtunnels.ms/logistica', // Ajusta el /api/v1 según tu API
    headers: { 'Content-Type': 'application/json' },
});

// Instancia para Donación (Puerto 3002)
export const donacionApi = axios.create({
    baseURL: 'https://wg68k7qz-8080.brs.devtunnels.ms/donacion',
    headers: { 'Content-Type': 'application/json' },
});

// Instancia para Necesidades (Puerto 3003)
/*
export const necesidadesApi = axios.create({
    baseURL: 'http://localhost:8080/necesidades',
    headers: { 'Content-Type': 'application/json' },
});
*/

// Instancia para Necesidades api node(Puerto 3000)
export const necesidadesApi = axios.create({
    baseURL: 'https://wg68k7qz-8080.brs.devtunnels.ms/need-node/api',
    headers: { 'Content-Type': 'application/json' },
});