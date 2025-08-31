'use client'

import {useActionState, useState, useEffect, ChangeEvent, FormEvent, startTransition, useRef} from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import ImageUploader from "@/app/ui/components/input-components/image-filed";
import BackButton from '@/app/ui/components/navigation-components/back-btn';
import { EditProfileState, editProfile } from '@/app/actions/profile/edit-profile'
import { useUser } from '../../lib/user-context';
import { useRouter } from 'next/navigation';
import {useEdgeStore} from "@/app/lib/edgestore";
import {CircleAlert} from "lucide-react";
import LogoutButton from "@/app/ui/components/navigation-components/logout-btn";

interface FormDataState {
    img: string;
    key: string;
    name: string;
    tag: string;
    bio: string;
}

export default function EditProfile() {
    const user = useUser();
    const router = useRouter();
    const [file, setFile]       = useState<File | null>(null);
    const [pendingFile, setPendingFile]   = useState<boolean>(false);
    const { edgestore } = useEdgeStore();
    const oldImageRef = useRef<string>(user?.image);
    const [imageChange, setImageChange]   = useState<boolean>(false);

    const [state, action, pending] = useActionState<EditProfileState, FormData>(
        (prev, data) => editProfile(prev, data),
        {
            success: false,
            errors: {}
        }
    );

    const [formData, setFormData] = useState<FormDataState>({
        img: user?.image || "",
        key: user?.image_key || "",
        name: user?.name || "",
        tag: user?.tag || "",
        bio: user?.bio || "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (newImage: string) => {
        setFormData((prev) => ({ ...prev, img: newImage }));
    };

    // const handleImageKeyChange = (newImageKey: string) => {
    //     setFormData((prev) => ({ ...prev, key: newImageKey }));
    // };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);

        if (file) {
            setPendingFile(true);
            try {
                const { url, path } = await edgestore.publicFiles.upload({
                    file,
                    input:   { type: `profile/${user?.id}` },
                    options: {
                        temporary: false,
                    },
                })

                fd.set("img", url)
                fd.set("key", path.type)
                setImageChange(true);
            } catch (err) {
                console.error("Upload error:", err);
                return;
            } finally {
                setPendingFile(false);
            }
        }

        console.log(fd)

        startTransition(() => {
            action(fd);
        })
    };

    useEffect(() => {
        if (!state.success) return;

        (async () => {
            try {
                console.log(oldImageRef.current);
                if (imageChange && oldImageRef.current) {
                    await edgestore.publicFiles.delete({ url: oldImageRef.current });
                }
            } catch (err) {
                console.error("Couldn’t delete old image:", err);
            }
            router.push("/profile");
            router.refresh();
        })();
    }, [state.success, formData.img, edgestore, router, imageChange]);




    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center py-4 px-10 gap-3 text-white text-md w-full h-full bg-gray-800 relative">
            <BackButton />
            <div className="flex flex-col items-center text-center">
                <div className="font-bold text-lg">
                    @{user?.tag} / <span className="text-indigo-400">Edit Profile</span>
                </div>
            </div>
            <input type="hidden" name="img" value={formData.img} />
            <input type="hidden" name="key" value={formData.key} />
            <ImageUploader url={formData.img} setUrl={handleImageChange} file={file} setFile={setFile} isPfp={true}/>
            <div className="text-center pt-2 text-sm px-6">
                Click a <span className="text-indigo-400">plus icon</span> or drag & drop your new pfp.
            </div>
            <div className="flex items-center w-full pt-3">
                <div className="h-px flex-grow bg-white/50 z-10"></div>
            </div>
            <div className="w-full pt-4 text-red-500">
                <div>
                    {state?.errors?.tag?.map((msg, idx) => (
                        <div className="border border-white/50 bg-indigo-400/20 px-4 py-3 mb-3 w-full rounded-lg hover:bg-indigo-400/10 flex" key={idx}>
                            <div className="pr-2 pt-1">
                                <CircleAlert size={24} />
                            </div>
                            <div>
                                {msg}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full relative pt-0">
                <div className="flex justify-start absolute px-4 py-3 text-white/50 w-1/3">Name:</div>
                <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border border-white/50 bg-indigo-400/20 pr-4 pl-[33.3%] py-3 w-full rounded-lg hover:bg-indigo-400/10"
                />
            </div>
            <div className="w-full relative">
                <div className="flex justify-start absolute px-4 py-3 text-white/50 w-1/3">Tag:</div>
                <input
                    id="tag"
                    name="tag"
                    value={formData.tag}
                    onChange={handleChange}
                    className="border border-white/50 bg-indigo-400/20 pr-4 pl-[33.3%] py-3 w-full rounded-lg hover:bg-indigo-400/10"
                />
            </div>
            <div className="w-full relative">
                <div className="flex justify-start absolute px-4 py-3 text-white/50 w-1/3">Bio:</div>
                <TextareaAutosize
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    maxLength={200}
                    className="border border-white/50 bg-indigo-400/20 px-4 py-3 w-full rounded-lg hover:bg-indigo-400/10"
                    style={{ textIndent: '31.8%' }}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                    {formData.bio.length}/200
                </div>
            </div>
            <div className="flex justify-end w-full">
                <button type="submit" disabled={pending || pendingFile} className="btn w-3/5">
                    Save changes
                </button>
            </div>
            <div className="flex justify-end w-full">
                <LogoutButton/>
            </div>
        </form>
    );
}
