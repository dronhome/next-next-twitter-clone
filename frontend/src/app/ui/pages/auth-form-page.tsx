'use client'

import Link from 'next/link';
import { useTransition } from "react";
import { signInWithGoogle } from '../../actions/auth/auth-providers';

interface AuthFormProps {
    signup?: boolean;
}

export default function AuthFormPage({ signup = false }: AuthFormProps) {
    const [isPending, startTransition] = useTransition();

    const authOptionClasses = "flex items-center gap-2 border border-white/50 bg-indigo-400/20 px-7 py-3 w-full rounded-lg cursor-pointer hover:bg-indigo-400/10 opacity-80";

    return (
        <div className="h-screen flex justify-center items-center">
            <div className="text-white text-lg flex flex-col h-screen font-sans sm:max-w-lg bg-gray-800 sm:h-3/4 sm:rounded-xl overflow-hidden sm:border sm:border-white/20">
                <div className="flex-grow flex flex-col items-center py-16 px-10 gap-5">
                    <div className="flex flex-col items-center text-center gap-4 pb-4">
                        <div className="text-3xl font-bold">
                            {signup ? 'Register for' : 'Log in to'} <span className="text-indigo-400">My App</span>
                        </div>
                        <div className="opacity-50">
                            {signup
                                ? 'Register your account to start using our app. Choose desired authentication method.'
                                : 'Sign in to your existing account to continue using our app. Choose desired authentication method.'
                            }
                        </div>
                    </div>
                    <Link href={`${signup ? 'signup' : 'signin'}/form`} className={authOptionClasses}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </div>
                        <div>
                            {signup ? 'Continue with email' : 'Use email / username'}
                        </div>
                    </Link>
                    <div className="flex items-center gap-4 w-full">
                        <div className="h-px flex-grow bg-white/50 z-10"></div>
                        <span className="text-gray-500 text-sm">or</span>
                        <div className="h-px flex-grow bg-white/50"></div>
                    </div>
                    <button
                        onClick={() => startTransition(() => signInWithGoogle())}
                        className={authOptionClasses}
                        disabled={isPending}
                    >
                        <div>
                            <img src="/logos/google-logo-png.png" alt="Google logo" className="w-auto h-7" />
                        </div>
                        <div>{isPending ? "Processing..." : "Continue with Google"}</div>
                    </button>
                    <button className={authOptionClasses}>
                        <div>
                            <img src="/logos/github-logo-png.png" alt="GitHub logo" className="w-auto h-7" />
                        </div>
                        <div>Continue with GitHub</div>
                    </button>
                </div>
                <div className="flex items-center py-3 justify-center bg-indigo-400/10 gap-2 max-w-none h-14">
                    <div>
                        {signup ? 'Already have an account?' : "Don't have an account?"}
                    </div>
                    <Link href={signup ? '/signin' : '/signup'} className="hover:underline cursor-pointer text-indigo-400">
                        {signup ? 'Sign in' : 'Sign up'}
                    </Link>
                </div>
            </div>
        </div>
    );
}
