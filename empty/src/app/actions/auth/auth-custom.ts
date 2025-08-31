import { SigninFormSchema, SignupFormSchema } from "@/app/lib/definitions";
import axios from "axios";

interface AuthState {
    success?: boolean;
    response?: unknown;
    user?: unknown;
    errors?: Record<string, string[]>;
    message?: string;
}

export async function signup(state: AuthState, formData: FormData): Promise<AuthState> {
    const validatedFields = SignupFormSchema.safeParse({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        confirmPassword: formData.get("confirmPassword") as string,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { email, password } = validatedFields.data;

    try {
        const response = await axios.post("/api/signup", {
            email,
            password,
        });

        return { success: true, response };
    } catch (error) {
        const errorMessage = (axios.isAxiosError(error) && error.response?.data?.message) || "An unexpected error occurred";
        return { success: false, message: errorMessage };
    }
}

export async function signin(state: AuthState, formData: FormData): Promise<AuthState> {
    const validatedFields = SigninFormSchema.safeParse({
        nameoremail: formData.get("nameoremail") as string,
        password: formData.get("password") as string,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { nameoremail, password } = validatedFields.data;

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nameoremail);
    const loginField = isEmail ? "email" : "name";

    try {
        const response = await axios.post("/api/signin", {
            [loginField]: nameoremail,
            password,
        });

        return { success: true, user: response.data.user };
    } catch (error) {
        const errorMessage = (axios.isAxiosError(error) && error.response?.data?.message) || "Invalid credentials.";
        return { success: false, message: errorMessage };
    }
}
