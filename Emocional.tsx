import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
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
    Slider,
    Rating,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider
} from '@mui/material';
import {
    Mood as MoodIcon,
    SentimentSatisfied as SatisfiedIcon,
    SentimentNeutral as NeutralIcon,
    SentimentDissatisfied as DissatisfiedIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { emocionalService } from '../services/api';
import { CheckIn, Evento } from '../types';

const Emocional: React.FC = () => {
    const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [openCheckIn, setOpenCheckIn] = useState(false);
    const [openEvento, setOpenEvento] = useState(false);
    const [checkInAtual, setCheckInAtual] = useState<Partial<CheckIn>>({
        humor: 3,
        energia: 5,
        estresse: 3,
        observacoes: ''
    });
    const [eventoAtual, setEventoAtual] = useState<Partial<Evento>>({
        tipo: 'positivo',
        descricao: '',
        impacto: 3
    });

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const [checkInsResponse, eventosResponse] = await Promise.all([
                emocionalService.listarCheckIns(),
                emocionalService.listarEventos()
            ]);
            setCheckIns(checkInsResponse.data);
            setEventos(eventosResponse.data);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    };

    const handleOpenCheckIn = () => {
        setCheckInAtual({
            humor: 3,
            energia: 5,
            estresse: 3,
            observacoes: ''
        });
        setOpenCheckIn(true);
    };

    const handleOpenEvento = () => {
        setEventoAtual({
            tipo: 'positivo',
            descricao: '',
            impacto: 3
        });
        setOpenEvento(true);
    };

    const handleCloseCheckIn = () => {
        setOpenCheckIn(false);
        setCheckInAtual({});
    };

    const handleCloseEvento = () => {
        setOpenEvento(false);
        setEventoAtual({});
    };

    const handleSubmitCheckIn = async () => {
        try {
            await emocionalService.registrarCheckIn(checkInAtual);
            handleCloseCheckIn();
            carregarDados();
        } catch (error) {
            console.error('Erro ao registrar check-in:', error);
        }
    };

    const handleSubmitEvento = async () => {
        try {
            await emocionalService.registrarEvento(eventoAtual);
            handleCloseEvento();
            carregarDados();
        } catch (error) {
            console.error('Erro ao registrar evento:', error);
        }
    };

    const getHumorIcon = (valor: number) => {
        if (valor >= 4) return <SatisfiedIcon color="success" />;
        if (valor >= 2) return <NeutralIcon color="warning" />;
        return <DissatisfiedIcon color="error" />;
    };

    const getEventoIcon = (tipo: string) => {
        switch (tipo) {
            case 'positivo':
                return <SatisfiedIcon color="success" />;
            case 'negativo':
                return <DissatisfiedIcon color="error" />;
            default:
                return <NeutralIcon color="warning" />;
        }
    };

    const calcularMediaHumor = () => {
        if (checkIns.length === 0) return 0;
        const soma = checkIns.reduce((acc, checkIn) => acc + checkIn.humor, 0);
        return soma / checkIns.length;
    };

    const calcularMediaEnergia = () => {
        if (checkIns.length === 0) return 0;
        const soma = checkIns.reduce((acc, checkIn) => acc + checkIn.energia, 0);
        return soma / checkIns.length;
    };

    const calcularMediaEstresse = () => {
        if (checkIns.length === 0) return 0;
        const soma = checkIns.reduce((acc, checkIn) => acc + checkIn.estresse, 0);
        return soma / checkIns.length;
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Monitoramento Emocional
            </Typography>

            <Grid container spacing={3}>
                {/* Cards de Resumo */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Humor Médio
                            </Typography>
                            <Box display="flex" alignItems="center">
                                <Rating
                                    value={calcularMediaHumor()}
                                    readOnly
                                    precision={0.5}
                                    max={5}
                                />
                                <Typography variant="h4" sx={{ ml: 2 }}>
                                    {calcularMediaHumor().toFixed(1)}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Nível de Energia
                            </Typography>
                            <Box display="flex" alignItems="center">
                                <Slider
                                    value={calcularMediaEnergia()}
                                    readOnly
                                    max={10}
                                    sx={{ width: '60%' }}
                                />
                                <Typography variant="h4" sx={{ ml: 2 }}>
                                    {calcularMediaEnergia().toFixed(1)}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Nível de Estresse
                            </Typography>
                            <Box display="flex" alignItems="center">
                                <Slider
                                    value={calcularMediaEstresse()}
                                    readOnly
                                    max={10}
                                    sx={{ width: '60%' }}
                                />
                                <Typography variant="h4" sx={{ ml: 2 }}>
                                    {calcularMediaEstresse().toFixed(1)}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Botões de Ação */}
                <Grid item xs={12}>
                    <Box display="flex" gap={2}>
                        <Button
                            variant="contained"
                            startIcon={<MoodIcon />}
                            onClick={handleOpenCheckIn}
                        >
                            Novo Check-in
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleOpenEvento}
                        >
                            Registrar Evento
                        </Button>
                    </Box>
                </Grid>

                {/* Lista de Check-ins Recentes */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Check-ins Recentes
                        </Typography>
                        <List>
                            {checkIns.slice(0, 5).map((checkIn) => (
                                <React.Fragment key={checkIn.id}>
                                    <ListItem>
                                        <ListItemIcon>
                                            {getHumorIcon(checkIn.humor)}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={`Humor: ${checkIn.humor}/5`}
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body2">
                                                        Energia: {checkIn.energia}/10
                                                    </Typography>
                                                    <br />
                                                    <Typography component="span" variant="body2">
                                                        Estresse: {checkIn.estresse}/10
                                                    </Typography>
                                                    {checkIn.observacoes && (
                                                        <>
                                                            <br />
                                                            <Typography component="span" variant="body2">
                                                                {checkIn.observacoes}
                                                            </Typography>
                                                        </>
                                                    )}
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Lista de Eventos Recentes */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Eventos Recentes
                        </Typography>
                        <List>
                            {eventos.slice(0, 5).map((evento) => (
                                <React.Fragment key={evento.id}>
                                    <ListItem>
                                        <ListItemIcon>
                                            {getEventoIcon(evento.tipo)}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={evento.descricao}
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body2">
                                                        Tipo: {evento.tipo}
                                                    </Typography>
                                                    <br />
                                                    <Typography component="span" variant="body2">
                                                        Impacto: {evento.impacto}/5
                                                    </Typography>
                                                </>
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

            {/* Dialog de Check-in */}
            <Dialog open={openCheckIn} onClose={handleCloseCheckIn} maxWidth="sm" fullWidth>
                <DialogTitle>Novo Check-in</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <Typography gutterBottom>Humor</Typography>
                            <Rating
                                value={checkInAtual.humor}
                                onChange={(_, value) => setCheckInAtual({ ...checkInAtual, humor: value || 3 })}
                                max={5}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography gutterBottom>Nível de Energia</Typography>
                            <Slider
                                value={checkInAtual.energia}
                                onChange={(_, value) => setCheckInAtual({ ...checkInAtual, energia: value as number })}
                                min={1}
                                max={10}
                                marks
                                valueLabelDisplay="auto"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography gutterBottom>Nível de Estresse</Typography>
                            <Slider
                                value={checkInAtual.estresse}
                                onChange={(_, value) => setCheckInAtual({ ...checkInAtual, estresse: value as number })}
                                min={1}
                                max={10}
                                marks
                                valueLabelDisplay="auto"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Observações"
                                value={checkInAtual.observacoes}
                                onChange={(e) => setCheckInAtual({ ...checkInAtual, observacoes: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCheckIn}>Cancelar</Button>
                    <Button onClick={handleSubmitCheckIn} variant="contained">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog de Evento */}
            <Dialog open={openEvento} onClose={handleCloseEvento} maxWidth="sm" fullWidth>
                <DialogTitle>Novo Evento</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Tipo de Evento</InputLabel>
                                <Select
                                    value={eventoAtual.tipo}
                                    label="Tipo de Evento"
                                    onChange={(e) => setEventoAtual({ ...eventoAtual, tipo: e.target.value })}
                                >
                                    <MenuItem value="positivo">Positivo</MenuItem>
                                    <MenuItem value="negativo">Negativo</MenuItem>
                                    <MenuItem value="neutro">Neutro</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Descrição"
                                value={eventoAtual.descricao}
                                onChange={(e) => setEventoAtual({ ...eventoAtual, descricao: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography gutterBottom>Impacto</Typography>
                            <Rating
                                value={eventoAtual.impacto}
                                onChange={(_, value) => setEventoAtual({ ...eventoAtual, impacto: value || 3 })}
                                max={5}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEvento}>Cancelar</Button>
                    <Button onClick={handleSubmitEvento} variant="contained">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Emocional; 