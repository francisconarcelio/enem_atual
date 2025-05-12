import axios from 'axios';
import { AuthResponse, LoginData, RegistroData, Tarefa, CheckIn, Evento, Curso } from '../types';

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('@AGEI:token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Serviços de Autenticação
export const authService = {
    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    registro: async (data: RegistroData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/registro', data);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('@AGEI:token');
    }
};

// Serviços de Tarefas
export const tarefaService = {
    listarTarefas: async (): Promise<Tarefa[]> => {
        const response = await api.get<Tarefa[]>('/tarefas');
        return response.data;
    },

    criarTarefa: async (tarefa: Omit<Tarefa, 'id' | 'data_criacao'>): Promise<Tarefa> => {
        const response = await api.post<Tarefa>('/tarefas', tarefa);
        return response.data;
    },

    atualizarTarefa: async (id: number, tarefa: Partial<Tarefa>): Promise<Tarefa> => {
        const response = await api.put<Tarefa>(`/tarefas/${id}`, tarefa);
        return response.data;
    },

    excluirTarefa: async (id: number): Promise<void> => {
        await api.delete(`/tarefas/${id}`);
    }
};

// Serviços de Monitoramento Emocional
export const emocionalService = {
    listarCheckIns: async (): Promise<CheckIn[]> => {
        const response = await api.get<CheckIn[]>('/emocional/check-ins');
        return response.data;
    },

    registrarCheckIn: async (checkIn: Omit<CheckIn, 'id' | 'timestamp'>): Promise<CheckIn> => {
        const response = await api.post<CheckIn>('/emocional/check-ins', checkIn);
        return response.data;
    },

    listarEventos: async (): Promise<Evento[]> => {
        const response = await api.get<Evento[]>('/emocional/eventos');
        return response.data;
    },

    registrarEvento: async (evento: Omit<Evento, 'id' | 'timestamp'>): Promise<Evento> => {
        const response = await api.post<Evento>('/emocional/eventos', evento);
        return response.data;
    },

    obterAnalise: async (): Promise<any> => {
        const response = await api.get('/emocional/analise');
        return response.data;
    }
};

// Serviços de Formação
export const formacaoService = {
    listarCursos: async (): Promise<Curso[]> => {
        const response = await api.get<Curso[]>('/formacao/cursos');
        return response.data;
    },

    criarCurso: async (curso: Omit<Curso, 'id' | 'data_criacao' | 'modulos'>): Promise<Curso> => {
        const response = await api.post<Curso>('/formacao/cursos', curso);
        return response.data;
    },

    atualizarCurso: async (id: number, curso: Partial<Curso>): Promise<Curso> => {
        const response = await api.put<Curso>(`/formacao/cursos/${id}`, curso);
        return response.data;
    },

    excluirCurso: async (id: number): Promise<void> => {
        await api.delete(`/formacao/cursos/${id}`);
    },

    obterSugestoes: async (): Promise<Curso[]> => {
        const response = await api.get<Curso[]>('/formacao/sugestoes');
        return response.data;
    }
}; 