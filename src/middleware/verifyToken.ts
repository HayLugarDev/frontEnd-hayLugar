export const verifyActiveSession = async (route: string, sessionExpired: boolean) => {
    if (sessionExpired) {
        return false;
    }
    return true;
}

