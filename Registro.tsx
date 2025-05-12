import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Link
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Registro: React.FC = () => {
    const navigate = useNavigate();
    const { registro } = useAuth();
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        cargo: '',
        escola: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registro(formData);
            navigate('/dashboard');
        } catch (err) {
            setError('Erro ao registrar usuário');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%'
                    }}
                >
                    <Typography component="h1" variant="h5">
                        AGEI - Registro
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="nome"
                            label="Nome Completo"
                            name="nome"
                            autoComplete="name"
                            autoFocus
                            value={formData.nome}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="senha"
                            label="Senha"
                            type="password"
                            id="senha"
                            autoComplete="new-password"
                            value={formData.senha}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="cargo"
                            label="Cargo"
                            id="cargo"
                            value={formData.cargo}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="escola"
                            label="Escola"
                            id="escola"
                            value={formData.escola}
                            onChange={handleChange}
                        />
                        {error && (
                            <Typography color="error" sx={{ mt: 1 }}>
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Registrar
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Link href="/login" variant="body2">
                                {"Já tem uma conta? Faça login"}
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Registro; 