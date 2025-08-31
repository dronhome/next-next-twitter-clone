import { z } from "zod";

export const SignupFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
    password: z
        .string()
        .min(8, { message: "Be at least 8 characters long" })
        .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
        .regex(/[0-9]/, { message: "Contain at least one number." })
        .regex(/[^a-zA-Z0-9]/, {
            message: "Contain at least one special character.",
        })
        .trim(),
    confirmPassword: z.string().trim(),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});


export const SigninFormSchema = z.object({
    nameoremail: z.string().trim().refine((value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length >= 2;
    }, {
        message: "Must be a valid email or a name with at least 2 characters.",
    }),
    password: z.string().min(8, { message: "Be at least 8 characters long." })
});

export const EditProfileSchema = z.object({
    img: z
        .string()
        .url({ message: "Must be a valid URL." })
        .refine(
            (url) =>
                /\.(png|jpe?g|gif|webp|bmp)$/i.test(
                new URL(url, "http://dummy").pathname
                ),
            { message: "URL must point to an image file (png, jpg, gif, etc.)." }
        ),
    img_key: z
        .string(),
    name: z
        .string()
        .min(1, { message: "Name cannot be empty." })
        .max(100, { message: "Name is too long." })
        .trim(),
    tag: z
        .string()
        .regex(/^[A-Za-z0-9_]+$/, {
            message:
                "Tag may only contain letters, numbers, and underscores (no spaces).",
        })
        .min(1, { message: "Tag cannot be empty." })
        .max(30, { message: "Tag is too long." }),
    bio: z
        .string()
        .min(0)
        .max(200, { message: "Bio must be at most 200 characters." })
        .trim(),
});

function optionalTrimmedString<T extends z.ZodTypeAny>(schema: T) {
    return z.preprocess(
        (val) => {
            if (val == null) return undefined;                         // catches null & undefined
            if (typeof val === "string" && val.trim() === "") return undefined;
            return val;
        },
        schema.optional()                                            // ← optional INSIDE the preprocess
    );
}

export const CreatePostSchema = z
    .object({
        image: optionalTrimmedString(
            z.string().url({ message: "Image must be a valid URL" })
        ),

        title: optionalTrimmedString(
            z
                .string()
                .min(1, { message: "Title cannot be empty" })
                .max(100, { message: "Title must be 100 characters or fewer" })
                .trim()
        ),

        body: optionalTrimmedString(
            z
                .string()
                .min(1, { message: "Body cannot be empty" })
                .max(1000, { message: "Body must be 1000 characters or fewer" })
                .trim()
        ),
    })
    .refine(
        (data) => Boolean(data.image || data.title || data.body),
        {
            message: "At least one of image, title, or body is required",
            path: ["image"],
        }
    );
