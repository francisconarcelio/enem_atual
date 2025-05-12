export interface Usuario {
    id: number;
    nome: string;
    email: string;
    cargo: string;
    escola: string;
    data_criacao: string;
}

export interface Tarefa {
    id: number;
    titulo: string;
    descricao: string;
    prioridade: 'baixa' | 'media' | 'alta';
    categoria: 'administrativa' | 'pedagogica' | 'gestao';
    prazo: string;
    concluida: boolean;
    data_criacao: string;
}

export interface CheckIn {
    id: number;
    humor: number;
    energia: number;
    estresse: number;
    observacoes: string;
    timestamp: string;
}

export interface Evento {
    id: number;
    tipo: 'positivo' | 'negativo' | 'neutro';
    descricao: string;
    impacto: number;
    timestamp: string;
}

export interface Modulo {
    id: number;
    titulo: string;
    descricao: string;
    duracao: number;
    concluido: boolean;
}

export interface Curso {
    id: number;
    titulo: string;
    descricao: string;
    tipo: 'online' | 'presencial' | 'hibrido';
    duracao: number;
    nivel: 'basico' | 'intermediario' | 'avancado';
    area: 'gestao' | 'pedagogia' | 'tecnologia' | 'lideranca';
    concluido: boolean;
    modulos: Modulo[];
    data_criacao: string;
}

export interface AuthResponse {
    token: string;
    usuario: Usuario;
}

export interface LoginData {
    email: string;
    senha: string;
}

export interface RegistroData {
    nome: string;
    email: string;
    senha: string;
    cargo: string;
    escola: string;
} 