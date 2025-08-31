"use client";

import React, { ChangeEvent } from "react";

interface Props {
    label: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    errorMessages?: string[] | undefined;
    type?: string;
    placeholder?: string;
}

export default function TextInputField({
                                           label,
                                           name,
                                           value,
                                           onChange,
                                           errorMessages = [],
                                           type = "text",
                                           placeholder = "",
                                       }: Props) {
    const id = name;

    return (
        <div className="w-full relative text-white">
            <label htmlFor={id} className="flex justify-start absolute px-4 py-3 text-white/50 w-1/3">
                {label}:
            </label>
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="border border-white/50 bg-indigo-400/20 pr-4 pl-[33.3%] py-3 w-full rounded-lg hover:bg-indigo-400/10"
            />
            {errorMessages?.map((msg, i) => (
                <p key={i} className="text-red-600 text-sm mt-1">{msg}</p>
            ))}
        </div>
    );
}
