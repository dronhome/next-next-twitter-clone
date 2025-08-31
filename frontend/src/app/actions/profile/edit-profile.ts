// 'use server'

import { EditProfileSchema } from "../../lib/definitions";
import axios from "axios";

export interface EditProfileState {
    success?: boolean;
    response?: unknown;
    errors?: Record<string, string[]>;
    message?: string;
}

export async function editProfile(state: EditProfileState, formData: FormData): Promise<EditProfileState> {
    const validatedFields = EditProfileSchema.safeParse({
            img: formData.get("img") as string,
            img_key: formData.get("key") as string,
            name: formData.get("name") as string,
            tag: formData.get("tag") as string,
            bio: formData.get("bio") as string,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { img, img_key, name, tag, bio } = validatedFields.data;

    try {
        const response = await axios.post("/api/edit", {
            img,
            img_key,
            name,
            tag, 
            bio,
        });

        return { success: true, response };
    } catch (error) {
        const errorMessage = (axios.isAxiosError(error) && error.response?.data?.message) || "An unexpected error occurred";
        return { success: false, message: errorMessage };
    }
}