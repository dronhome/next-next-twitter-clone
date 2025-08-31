// src/app/ui/components/textarea-field.tsx
"use client";

import React from "react";
import TextareaAutosize from "react-textarea-autosize";

interface TextareaFieldProps {
    label: string;
    name: string;
    id?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    maxLength?: number;
    errorMessages?: string[] | undefined;
    placeholder?: string;
    showCounter?: boolean;
}

export default function TextareaField({
                                          label,
                                          name,
                                          id,
                                          value,
                                          onChange,
                                          maxLength,
                                          errorMessages = [],
                                          placeholder = "",
                                          showCounter = false,
                                      }: TextareaFieldProps) {
    const htmlId = id ?? name;
    const count = value.length;
    const limit = maxLength ?? 0;

    return (
        <div className={`w-full relative text-white`}>
            <label
                htmlFor={htmlId}
                className="flex justify-start absolute px-4 py-3 text-white/50 w-1/3"
            >
                {label}:
            </label>
            <TextareaAutosize
                id={htmlId}
                name={name}
                value={value}
                onChange={onChange}
                maxLength={maxLength}
                placeholder={placeholder}
                className="border border-white/50 bg-indigo-400/20 px-4 py-3 w-full rounded-lg hover:bg-indigo-400/10"
                style={{ textIndent: "31.8%" }}
            />
            {showCounter && maxLength && (
                <div className="text-right text-sm text-gray-500 mt-1">
                    {count}/{limit}
                </div>
            )}
            {errorMessages?.map((msg, i) => (
                <p key={i} className="text-red-600 text-sm mt-1 px-4">
                    {msg}
                </p>
            ))}
        </div>
    );
}
