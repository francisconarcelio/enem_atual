import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Chip,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import {
    School as SchoolIcon,
    PlayCircle as PlayIcon,
    Book as BookIcon,
    Assignment as AssignmentIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { formacaoService } from '../services/api';
import { Curso } from '../types';

const Formacao: React.FC = () => {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [sugestoes, setSugestoes] = useState<Curso[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [cursoAtual, setCursoAtual] = useState<Partial<Curso>>({
        titulo: '',
        descricao: '',
        tipo: 'online',
        duracao: '',
        nivel: 'intermediario',
        area: 'gestao'
    });

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const [cursosResponse, sugestoesResponse] = await Promise.all([
                formacaoService.listarCursos(),
                formacaoService.obterSugestoes()
            ]);
            setCursos(cursosResponse.data);
            setSugestoes(sugestoesResponse.data);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    };

    const handleOpenDialog = () => {
        setCursoAtual({
            titulo: '',
            descricao: '',
            tipo: 'online',
            duracao: '',
            nivel: 'intermediario',
            area: 'gestao'
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCursoAtual({});
    };

    const handleSubmit = async () => {
        try {
            await formacaoService.criarCurso(cursoAtual);
            handleCloseDialog();
            carregarDados();
        } catch (error) {
            console.error('Erro ao criar curso:', error);
        }
    };

    const getTipoIcon = (tipo: string) => {
        switch (tipo) {
            case 'online':
                return <PlayIcon />;
            case 'presencial':
                return <SchoolIcon />;
            default:
                return <BookIcon />;
        }
    };

    const getNivelColor = (nivel: string) => {
        switch (nivel) {
            case 'basico':
                return 'success';
            case 'intermediario':
                return 'warning';
            case 'avancado':
                return 'error';
            default:
                return 'default';
        }
    };

    const calcularProgresso = (curso: Curso) => {
        if (!curso.modulos || curso.modulos.length === 0) return 0;
        const modulosConcluidos = curso.modulos.filter(modulo => modulo.concluido).length;
        return (modulosConcluidos / curso.modulos.length) * 100;
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Formação Continuada
            </Typography>

            <Grid container spacing={3}>
                {/* Cursos em Andamento */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">
                                Cursos em Andamento
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleOpenDialog}
                            >
                                Novo Curso
                            </Button>
                        </Box>
                        <List>
                            {cursos.filter(curso => !curso.concluido).map((curso) => (
                                <React.Fragment key={curso.id}>
                                    <ListItem>
                                        <ListItemIcon>
                                            {getTipoIcon(curso.tipo)}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={curso.titulo}
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body2">
                                                        {curso.descricao}
                                                    </Typography>
                                                    <br />
                                                    <Box sx={{ mt: 1 }}>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={calcularProgresso(curso)}
                                                            sx={{ mb: 1 }}
                                                        />
                                                        <Typography variant="caption">
                                                            Progresso: {calcularProgresso(curso).toFixed(0)}%
                                                        </Typography>
                                                    </Box>
                                                </>
                                            }
                                        />
                                        <Box>
                                            <Chip
                                                label={curso.nivel.toUpperCase()}
                                                color={getNivelColor(curso.nivel)}
                                                size="small"
                                                sx={{ mr: 1 }}
                                            />
                                            <Chip
                                                label={curso.tipo.toUpperCase()}
                                                variant="outlined"
                                                size="small"
                                                sx={{ mr: 1 }}
                                            />
                                            <Chip
                                                label={`${curso.duracao}h`}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Box>
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Sugestões de Cursos */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Sugestões Personalizadas
                        </Typography>
                        <Grid container spacing={2}>
                            {sugestoes.map((curso) => (
                                <Grid item xs={12} md={4} key={curso.id}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                {curso.titulo}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                {curso.descricao}
                                            </Typography>
                                            <Box display="flex" gap={1} flexWrap="wrap">
                                                <Chip
                                                    label={curso.nivel.toUpperCase()}
                                                    color={getNivelColor(curso.nivel)}
                                                    size="small"
                                                />
                                                <Chip
                                                    label={curso.tipo.toUpperCase()}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                                <Chip
                                                    label={`${curso.duracao}h`}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </Box>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" startIcon={<AssignmentIcon />}>
                                                Iniciar Curso
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Dialog de Novo Curso */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Novo Curso</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Título"
                                value={cursoAtual.titulo}
                                onChange={(e) => setCursoAtual({ ...cursoAtual, titulo: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Descrição"
                                value={cursoAtual.descricao}
                                onChange={(e) => setCursoAtual({ ...cursoAtual, descricao: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Tipo</InputLabel>
                                <Select
                                    value={cursoAtual.tipo}
                                    label="Tipo"
                                    onChange={(e) => setCursoAtual({ ...cursoAtual, tipo: e.target.value })}
                                >
                                    <MenuItem value="online">Online</MenuItem>
                                    <MenuItem value="presencial">Presencial</MenuItem>
                                    <MenuItem value="hibrido">Híbrido</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Duração (horas)"
                                value={cursoAtual.duracao}
                                onChange={(e) => setCursoAtual({ ...cursoAtual, duracao: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Nível</InputLabel>
                                <Select
                                    value={cursoAtual.nivel}
                                    label="Nível"
                                    onChange={(e) => setCursoAtual({ ...cursoAtual, nivel: e.target.value })}
                                >
                                    <MenuItem value="basico">Básico</MenuItem>
                                    <MenuItem value="intermediario">Intermediário</MenuItem>
                                    <MenuItem value="avancado">Avançado</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Área</InputLabel>
                                <Select
                                    value={cursoAtual.area}
                                    label="Área"
                                    onChange={(e) => setCursoAtual({ ...cursoAtual, area: e.target.value })}
                                >
                                    <MenuItem value="gestao">Gestão</MenuItem>
                                    <MenuItem value="pedagogia">Pedagogia</MenuItem>
                                    <MenuItem value="tecnologia">Tecnologia</MenuItem>
                                    <MenuItem value="lideranca">Liderança</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Formacao; 