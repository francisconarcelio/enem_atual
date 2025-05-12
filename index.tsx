import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/Layout'
import Login from '../pages/Login'
import Registro from '../pages/Registro'
import Dashboard from '../pages/Dashboard'
import Tarefas from '../pages/Tarefas'
import Emocional from '../pages/Emocional'
import Formacao from '../pages/Formacao'

interface PrivateRouteProps {
    children: React.ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { usuario, carregando } = useAuth()

    if (carregando) {
        return <div>Carregando...</div>
    }

    if (!usuario) {
        return <Navigate to="/login" />
    }

    return <Layout>{children}</Layout>
}

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route
                path="/"
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
        </Routes>
    )
}

export default AppRoutes 