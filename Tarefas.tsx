import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Grid,
    Checkbox
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';
import { tarefaService } from '../services/api';
import { Tarefa } from '../types';

const Tarefas: React.FC = () => {
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [tarefaAtual, setTarefaAtual] = useState<Partial<Tarefa>>({
        titulo: '',
        descricao: '',
        prioridade: 'media',
        prazo: '',
        categoria: 'administrativa'
    });
    const [filtros, setFiltros] = useState({
        status: 'todas',
        prioridade: 'todas',
        categoria: 'todas'
    });

    useEffect(() => {
        carregarTarefas();
    }, []);

    const carregarTarefas = async () => {
        try {
            const response = await tarefaService.listarTarefas();
            setTarefas(response.data);
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
        }
    };

    const handleOpenDialog = (tarefa?: Tarefa) => {
        if (tarefa) {
            setTarefaAtual(tarefa);
        } else {
            setTarefaAtual({
                titulo: '',
                descricao: '',
                prioridade: 'media',
                prazo: '',
                categoria: 'administrativa'
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setTarefaAtual({});
    };

    const handleSubmit = async () => {
        try {
            if (tarefaAtual.id) {
                await tarefaService.atualizarTarefa(tarefaAtual.id, tarefaAtual);
            } else {
                await tarefaService.criarTarefa(tarefaAtual);
            }
            handleCloseDialog();
            carregarTarefas();
        } catch (error) {
            console.error('Erro ao salvar tarefa:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
            try {
                await tarefaService.excluirTarefa(id);
                carregarTarefas();
            } catch (error) {
                console.error('Erro ao excluir tarefa:', error);
            }
        }
    };

    const handleToggleStatus = async (tarefa: Tarefa) => {
        try {
            await tarefaService.atualizarTarefa(tarefa.id, {
                ...tarefa,
                concluida: !tarefa.concluida
            });
            carregarTarefas();
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
        }
    };

    const getPrioridadeColor = (prioridade: string) => {
        switch (prioridade) {
            case 'alta':
                return 'error';
            case 'media':
                return 'warning';
            case 'baixa':
                return 'success';
            default:
                return 'default';
        }
    };

    const tarefasFiltradas = tarefas.filter(tarefa => {
        if (filtros.status !== 'todas' && tarefa.concluida !== (filtros.status === 'concluidas')) {
            return false;
        }
        if (filtros.prioridade !== 'todas' && tarefa.prioridade !== filtros.prioridade) {
            return false;
        }
        if (filtros.categoria !== 'todas' && tarefa.categoria !== filtros.categoria) {
            return false;
        }
        return true;
    });

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Tarefas</Typography>
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<FilterIcon />}
                        onClick={() => setOpenFilter(true)}
                        sx={{ mr: 2 }}
                    >
                        Filtros
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                    >
                        Nova Tarefa
                    </Button>
                </Box>
            </Box>

            <Paper>
                <List>
                    {tarefasFiltradas.map((tarefa) => (
                        <ListItem
                            key={tarefa.id}
                            divider
                            sx={{
                                opacity: tarefa.concluida ? 0.7 : 1,
                                textDecoration: tarefa.concluida ? 'line-through' : 'none'
                            }}
                        >
                            <Checkbox
                                checked={tarefa.concluida}
                                onChange={() => handleToggleStatus(tarefa)}
                            />
                            <ListItemText
                                primary={tarefa.titulo}
                                secondary={
                                    <>
                                        <Typography component="span" variant="body2">
                                            {tarefa.descricao}
                                        </Typography>
                                        <br />
                                        <Typography component="span" variant="caption">
                                            Prazo: {new Date(tarefa.prazo).toLocaleDateString()}
                                        </Typography>
                                    </>
                                }
                            />
                            <ListItemSecondaryAction>
                                <Chip
                                    label={tarefa.prioridade.toUpperCase()}
                                    color={getPrioridadeColor(tarefa.prioridade)}
                                    size="small"
                                    sx={{ mr: 1 }}
                                />
                                <IconButton
                                    edge="end"
                                    aria-label="edit"
                                    onClick={() => handleOpenDialog(tarefa)}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => handleDelete(tarefa.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* Dialog de Criação/Edição */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {tarefaAtual.id ? 'Editar Tarefa' : 'Nova Tarefa'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Título"
                                value={tarefaAtual.titulo}
                                onChange={(e) => setTarefaAtual({ ...tarefaAtual, titulo: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Descrição"
                                value={tarefaAtual.descricao}
                                onChange={(e) => setTarefaAtual({ ...tarefaAtual, descricao: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Prioridade</InputLabel>
                                <Select
                                    value={tarefaAtual.prioridade}
                                    label="Prioridade"
                                    onChange={(e) => setTarefaAtual({ ...tarefaAtual, prioridade: e.target.value })}
                                >
                                    <MenuItem value="baixa">Baixa</MenuItem>
                                    <MenuItem value="media">Média</MenuItem>
                                    <MenuItem value="alta">Alta</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Categoria</InputLabel>
                                <Select
                                    value={tarefaAtual.categoria}
                                    label="Categoria"
                                    onChange={(e) => setTarefaAtual({ ...tarefaAtual, categoria: e.target.value })}
                                >
                                    <MenuItem value="administrativa">Administrativa</MenuItem>
                                    <MenuItem value="pedagogica">Pedagógica</MenuItem>
                                    <MenuItem value="gestao">Gestão</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Prazo"
                                value={tarefaAtual.prazo}
                                onChange={(e) => setTarefaAtual({ ...tarefaAtual, prazo: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
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

            {/* Dialog de Filtros */}
            <Dialog open={openFilter} onClose={() => setOpenFilter(false)}>
                <DialogTitle>Filtros</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={filtros.status}
                                    label="Status"
                                    onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
                                >
                                    <MenuItem value="todas">Todas</MenuItem>
                                    <MenuItem value="pendentes">Pendentes</MenuItem>
                                    <MenuItem value="concluidas">Concluídas</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Prioridade</InputLabel>
                                <Select
                                    value={filtros.prioridade}
                                    label="Prioridade"
                                    onChange={(e) => setFiltros({ ...filtros, prioridade: e.target.value })}
                                >
                                    <MenuItem value="todas">Todas</MenuItem>
                                    <MenuItem value="baixa">Baixa</MenuItem>
                                    <MenuItem value="media">Média</MenuItem>
                                    <MenuItem value="alta">Alta</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Categoria</InputLabel>
                                <Select
                                    value={filtros.categoria}
                                    label="Categoria"
                                    onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
                                >
                                    <MenuItem value="todas">Todas</MenuItem>
                                    <MenuItem value="administrativa">Administrativa</MenuItem>
                                    <MenuItem value="pedagogica">Pedagógica</MenuItem>
                                    <MenuItem value="gestao">Gestão</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenFilter(false)}>Fechar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Tarefas; 