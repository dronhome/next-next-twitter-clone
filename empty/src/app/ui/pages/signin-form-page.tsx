'use client'

import { signin } from '@/app/actions/auth/auth-custom';
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { CircleAlert, Eye, EyeOff } from 'lucide-react';

interface AuthState {
    success?: boolean;
    errors?: {
        nameoremail?: string[];
        password?: string[];
    };
}

interface FormDataState {
    nameoremail: string;
    password: string;
}

export default function SigninFormPage() {
    const [state, action, pending] = useActionState<AuthState, FormData>(
        async (prevState, formData) => signin(prevState, formData),
        { success: false, errors: {} } 
    );

    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.push("/");
            router.refresh();
        }
    }, [state?.success, router]);

    const [formData, setFormData] = useState<FormDataState>({
        nameoremail: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isFormValid =
        formData.nameoremail &&
        formData.password;


    return (
        <div className="h-screen flex flex-col text-white text-lg justify-center items-center">
            <div className="w-full flex flex-col h-screen bg-gray-800 font-sans sm:max-w-lg sm:h-3/4 sm:rounded-xl overflow-hidden sm:border sm:border-white/20">
                <form action={action} className="relative flex flex-col flex-grow items-center py-16 px-10 *:w-full gap-2">
                    <div className="flex flex-col items-center text-center gap-4 pb-4">
                        <div className="text-3xl font-bold">
                            <span className="text-indigo-400">Bebra App</span> / Authentication
                        </div>
                        <div className="opacity-50">Fill in your credentials</div>
                    </div>
                    <div>
                        <input
                            id="nameoremail"
                            name="nameoremail"
                            placeholder="Name or Email"
                            required
                            onChange={handleChange}
                            className="border border-white/50 bg-indigo-400/20 px-7 py-3 w-full rounded-lg hover:bg-indigo-400/10"
                        />
                    </div>

                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            required
                            onChange={handleChange}
                            className="border border-white/50 bg-indigo-400/20 px-7 py-3 w-full rounded-lg hover:bg-indigo-400/10"
                        />
                        { formData.password &&
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-4 opacity-80 hover:opacity-100"
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        }
                    </div>

                    <div className="flex items-center gap-2 ml-1 my-2 text-red-600">
                        {Object.values(state?.errors || {}).some((errArray) => errArray.length > 0) && <CircleAlert />}
                        {state?.errors?.nameoremail && <p>{state.errors.nameoremail[0]}</p>}
                        {state?.errors?.password && !state?.errors?.nameoremail && (
                            <p>Password must {state.errors.password[0].toLowerCase()}</p>
                        )}
                    </div>

                    <button
                        disabled={pending || !isFormValid}
                        type="submit"
                        className={`px-7 py-2 rounded-2xl font-bold transition ${
                            pending || !isFormValid
                                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                                : "bg-indigo-500 hover:bg-indigo-600 text-white"
                        }`}
                    >
                        Sign In
                    </button>
                    {pending && (
                        <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-indigo-300 via-indigo-600 to-indigo-300 animate-pulse"></div>
                    )}
                </form>
                <div className="flex w-full items-center py-3 justify-center bg-indigo-400/10 gap-2 max-w-none">
                    <div>{"Don't have an account?"}</div>
                    <Link href="/signup" className="hover:underline cursor-pointer text-indigo-400">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
