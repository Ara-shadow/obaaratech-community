import api from "./axios";


export interface Profile {

    id: string;

    name: string;

    email: string;

    phone?: string | null;

    avatar?: string | null;

    role: string;

    createdAt?: string;

}



export interface UpdateProfileData {

    name?: string;

    phone?: string;

    avatar?: string;

}



export async function getProfile(): Promise<Profile> {


    const response =
        await api.get(
            "/profile"
        );


    return response.data.profile;

}



export async function updateProfile(

    data: UpdateProfileData

): Promise<Profile> {


    const response =
        await api.patch(

            "/profile",

            data

        );


    return response.data.profile;

}