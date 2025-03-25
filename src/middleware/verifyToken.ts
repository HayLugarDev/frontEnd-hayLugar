export const verifyActiveSession = async (route: string, sessionExpired: boolean) => {
    console.log(`Ruta: ${route}, Sesión expirada: ${sessionExpired}`);
    if (sessionExpired) {
        return false;
    }
    return true;
}

