import api from './apiService'

export interface User {
    id: number
    name: string
    last_name: string
    email: string
    dni: string | null
    phone: string | null
    address: string | null
    role: 'user' | 'admin'
    profile_picture: string | null
    termsAccepted: boolean
    acceptedTermsVersion: string | null
    owner_rating: number | null
    renter_rating: number | null
    created_at: string
    updated_at: string
}

/** Trae los datos del usuario autenticado */
export async function getAuthenticatedUser(): Promise<User | null> {
    try {
        const { data } = await api.get<User>('/users/profile', { withCredentials: true })
        return data ?? null
    } catch (err) {
        console.error('getAuthenticatedUser error:', err)
        return null
    }
}

/** Actualiza la foto de perfil del usuario */
export async function updateUserPhoto(id: number, file: File): Promise<User | null> {
    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
        const { data } = await api.put(`/users/update/${id}/profile_picture`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true
        });

        return data ?? null;
    } catch (err) {
        console.error("updateUserPhoto error:", err);
        return null;
    }
}

/** Actualiza los datos del usuario autenticado */
export async function updateAuthenticatedUser(payload: {
    id: number
    name?: string
    last_name?: string
    phone?: string
    address?: string
}): Promise<User | null> {
    try {
        const { data } = await api.put(
            `/users/update/${payload.id}/personal-information`,
            payload,
            { withCredentials: true }
        );
        return data ?? "Error al actualizar usuario";
    } catch (err) {
        console.error("updateAuthenticatedUser error:", err);
        return null;
    }
}

/** Cambia la contraseña del usuario autenticado */
export async function changeAuthenticatedUserPassword(payload: {
    id: number
    current_password: string
    new_password: string
}): Promise<boolean> {
    try {
        await api.post(`/users/update/${payload.id}/change-password`, payload, { withCredentials: true })
        return true
    }
    catch (err) {
        console.error('changeAuthenticatedUserPassword error:', err)
        return false
    }
}