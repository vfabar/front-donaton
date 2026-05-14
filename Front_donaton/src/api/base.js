import axios from "axios";

// Instancia para Logística (Puerto 3001)
export const logisticaApi = axios.create({
    baseURL: 'http://localhost:8080/logistica', // Ajusta el /api/v1 según tu API
    headers: { 'Content-Type': 'application/json' },
});

// Instancia para Donación (Puerto 3002)
export const donacionApi = axios.create({
    baseURL: 'http://localhost:8080/donacion',
    headers: { 'Content-Type': 'application/json' },
});

// Instancia para Necesidades (Puerto 3003)
export const necesidadesApi = axios.create({
    baseURL: 'http://localhost:8080/necesidades',
    headers: { 'Content-Type': 'application/json' },
});