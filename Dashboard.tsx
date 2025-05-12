import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    LinearProgress,
    Button
} from '@mui/material';
import {
    Assignment as TarefasIcon,
    Mood as EmocionalIcon,
    School as FormacaoIcon,
    TrendingUp as TrendingUpIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { tarefaService, emocionalService, formacaoService } from '../services/api';
import { Tarefa, CheckIn, Curso } from '../types';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
    const [cursos, setCursos] = useState<Curso[]>([]);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const [tarefasResponse, checkInsResponse, cursosResponse] = await Promise.all([
                tarefaService.listarTarefas(),
                emocionalService.listarCheckIns(),
                formacaoService.listarCursos()
            ]);
            setTarefas(tarefasResponse.data);
            setCheckIns(checkInsResponse.data);
            setCursos(cursosResponse.data);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    };

    const tarefasPendentes = tarefas.filter(tarefa => !tarefa.concluida);
    const tarefasAtrasadas = tarefasPendentes.filter(tarefa => 
        new Date(tarefa.prazo) < new Date()
    );

    const calcularMediaHumor = () => {
        if (checkIns.length === 0) return 0;
        const soma = checkIns.reduce((acc, checkIn) => acc + checkIn.humor, 0);
        return soma / checkIns.length;
    };

    const cursosEmAndamento = cursos.filter(curso => !curso.concluido);
    const calcularProgressoCurso = (curso: Curso) => {
        if (!curso.modulos || curso.modulos.length === 0) return 0;
        const modulosConcluidos = curso.modulos.filter(modulo => modulo.concluido).length;
        return (modulosConcluidos / curso.modulos.length) * 100;
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            <Grid container spacing={3}>
                {/* Cards de Resumo */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Tarefas Pendentes
                            </Typography>
                            <Typography variant="h3" color="primary">
                                {tarefasPendentes.length}
                            </Typography>
                            {tarefasAtrasadas.length > 0 && (
                                <Typography color="error" sx={{ mt: 1 }}>
                                    {tarefasAtrasadas.length} tarefas atrasadas
                                </Typography>
                            )}
                            <Button
                                variant="outlined"
                                startIcon={<TarefasIcon />}
                                onClick={() => navigate('/tarefas')}
                                sx={{ mt: 2 }}
                            >
                                Ver Tarefas
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Bem-estar Emocional
                            </Typography>
                            <Box display="flex" alignItems="center">
                                <Typography variant="h3" color="primary">
                                    {calcularMediaHumor().toFixed(1)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                    /5
                                </Typography>
                            </Box>
                            <Button
                                variant="outlined"
                                startIcon={<EmocionalIcon />}
                                onClick={() => navigate('/emocional')}
                                sx={{ mt: 2 }}
                            >
                                Ver Detalhes
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Cursos em Andamento
                            </Typography>
                            <Typography variant="h3" color="primary">
                                {cursosEmAndamento.length}
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<FormacaoIcon />}
                                onClick={() => navigate('/formacao')}
                                sx={{ mt: 2 }}
                            >
                                Ver Cursos
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Lista de Tarefas Prioritárias */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Tarefas Prioritárias
                        </Typography>
                        <List>
                            {tarefasPendentes
                                .filter(tarefa => tarefa.prioridade === 'alta')
                                .slice(0, 5)
                                .map((tarefa) => (
                                    <React.Fragment key={tarefa.id}>
                                        <ListItem>
                                            <ListItemIcon>
                                                <WarningIcon color="error" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={tarefa.titulo}
                                                secondary={`Prazo: ${new Date(tarefa.prazo).toLocaleDateString()}`}
                                            />
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Progresso dos Cursos */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Progresso dos Cursos
                        </Typography>
                        <List>
                            {cursosEmAndamento.slice(0, 5).map((curso) => (
                                <React.Fragment key={curso.id}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <TrendingUpIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={curso.titulo}
                                            secondary={
                                                <Box sx={{ mt: 1 }}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={calcularProgressoCurso(curso)}
                                                        sx={{ mb: 1 }}
                                                    />
                                                    <Typography variant="caption">
                                                        {calcularProgressoCurso(curso).toFixed(0)}% concluído
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard; 