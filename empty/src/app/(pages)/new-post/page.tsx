"use client"

import BackButton from "@/app/ui/components/navigation-components/back-btn";
import PostForm from "@/app/ui/components/forms/post-form";
import { useRouter } from "next/navigation";
import {ChangeEvent, FormEvent, startTransition, useActionState, useEffect, useState} from "react";
import {createPost, CreatePostState} from "@/app/actions/posts/createPost";
import {useEdgeStore} from "@/app/lib/edgestore";
import {useUser} from "@/app/lib/user-context";

export default function NewPost() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [pendingFile, setPendingFile] = useState<boolean>(false);
    const { edgestore } = useEdgeStore();
    const user = useUser();

    const [state, action, pending] = useActionState<CreatePostState, FormData>(
        (prev, data) => createPost(prev, data),
        { success: false, errors: {} }
    );

    const [formData, setFormData] = useState({
        title: "",
        body:  "",
        image:   "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (newImage: string) => {
        setFormData((prev) => ({ ...prev, image: newImage }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData();
        fd.set("title", formData.title);
        fd.set("body",  formData.body);

        if (file) {
            setPendingFile(true);
            try {
                const { url } = await edgestore.publicFiles.upload({
                    file,
                    input:   { type: "post" },
                    options: {
                        temporary: false,
                    },
                })

                fd.set("image", url)
            } catch (err) {
                console.error("Upload error:", err);
                return;
            } finally {
                setPendingFile(false);
            }
        }

        startTransition(() => action(fd));
    };

    useEffect(() => {
        if (state.success) {
            router.push("/");
            router.refresh();
        }
    }, [state.success, router]);

    return(
        <div className={"relative px-10 text-white"}>
            <BackButton />
            <div className={"w-full h-full py-4 flex flex-col gap-3"}>
                <div className="flex flex-col items-center text-center text-lg">
                    <div className="font-bold">
                        @{user?.tag} / <span className="text-indigo-400">New Post</span>
                    </div>
                </div>
                <div>
                    <p className={"text-center text-sm text-white/70 pt-2"}>
                        Share <span className={"text-indigo-400 opacity-100"}>your</span> story — add a new post below to let the community know what’s on your mind.
                    </p>
                </div>
                <div className="flex items-center w-full py-3">
                    <div className="h-px flex-grow bg-white/50 z-10"></div>
                </div>
                <PostForm
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    pending={pending || pendingFile}
                    errors={state.errors}
                    file={file}
                    setFile={setFile}
                    handleImageChange={handleImageChange}
                />
            </div>
        </div>
    );
}