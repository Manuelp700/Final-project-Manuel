import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { StoreProvider } from './hooks/useGlobalReducer';
import { BackendURL } from './components/BackendURL';
import { AppThemeProvider } from "./theme/ThemeProvider";

const Main = () => {
    // Solo exigir VITE_BACKEND_URL en producción; en dev usamos proxy de Vite
    if (import.meta.env.PROD && (!import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL == "")) {
        return (
            <React.StrictMode>
                <BackendURL />
            </React.StrictMode>
        );
    }
    return (
        <React.StrictMode>
            <AppThemeProvider>
                <StoreProvider>
                    <RouterProvider router={router} />
                </StoreProvider>
            </AppThemeProvider>
        </React.StrictMode>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />)
