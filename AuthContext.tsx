import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario, LoginData, RegistroData } from '../types';
import { authService } from '../services/api';

interface AuthContextData {
    usuario: Usuario | null;
    loading: boolean;
    login: (data: LoginData) => Promise<void>;
    registro: (data: RegistroData) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // TODO: Implementar verificação do token
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (data: LoginData) => {
        const response = await authService.login(data);
        setUsuario(response.usuario);
    };

    const registro = async (data: RegistroData) => {
        const response = await authService.registro(data);
        setUsuario(response.usuario);
    };

    const logout = () => {
        authService.logout();
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, loading, login, registro, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}; 