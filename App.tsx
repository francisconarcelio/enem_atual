import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import Routes from './routes';
import './styles/global.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Tarefas from './pages/Tarefas';
import Emocional from './pages/Emocional';
import Formacao from './pages/Formacao';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { usuario, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  return <Layout>{children}</Layout>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/tarefas"
              element={
                <PrivateRoute>
                  <Tarefas />
                </PrivateRoute>
              }
            />
            <Route
              path="/emocional"
              element={
                <PrivateRoute>
                  <Emocional />
                </PrivateRoute>
              }
            />
            <Route
              path="/formacao"
              element={
                <PrivateRoute>
                  <Formacao />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 