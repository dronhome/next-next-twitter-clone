// import {useEdgeStore} from "@/app/lib/edgestore";
// import {useState} from "react";
import {Plus} from "lucide-react";
import {SingleImageDropzone} from "@/app/ui/components/input-components/single-image-dropzone";

interface ImageUploaderProps {
    url: string | null;
    file: File | null;
    setUrl: (url: string) => void;
    setFile: (file: File) => void;
    isPfp: boolean;
    className?: string;
}

export default function ImageUploader({ url, file, setUrl, setFile, isPfp, className }: ImageUploaderProps) {
    const imageClasses = isPfp ?
        "w-2/5 aspect-square rounded-full bg-gray-600 overflow-hidden" : url == "" ?
            "w-full bg-indigo-400/20 hover:bg-indigo-400/10 overflow-hidden border border-white/50 rounded-lg h-40" :
            "w-full bg-indigo-400/20 hover:bg-indigo-400/10 overflow-hidden border border-white/50 rounded-lg"

    return (
        <div className={`w-full flex justify-center text-white ${className}`}>
            <label className="w-full flex items-center relative justify-center cursor-pointer">
                <div className={imageClasses}>
                    {url &&
                        <img
                            src={url}
                            alt=""
                            className="w-full h-full object-cover object-center"
                        />
                    }
                </div>
                <div className="absolute -bottom-3 overflow-visible">
                    <div className="border border-white/40 bg-indigo-600 rounded-full p-0.5">
                        <Plus />
                    </div>
                </div>
                <SingleImageDropzone
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    width={200}
                    height={200}
                    value={file}
                    onChange={async (file) => {
                        if (file) {
                            setFile(file);
                            // const { url, path } = await edgestore.publicFiles.upload({
                            //     file,
                            //     input:   { type: "profile" },
                            //     options: { temporary: true },
                            // });
                            const previewUrl = URL.createObjectURL(file);
                            setUrl(previewUrl);
                        }
                    }}
                />
            </label>

            {/*<button className="btn mt-20"*/}
            {/*    onClick={async () => {*/}
            {/*        if (file) {*/}
            {/*            const res = await edgestore.publicFiles.upload({*/}
            {/*                file,*/}
            {/*                input: { type: "profile" },*/}
            {/*                options: {*/}
            {/*                    temporary: true,*/}
            {/*                },*/}
            {/*            });*/}

            {/*            // you can run some server action or api here*/}
            {/*            // to add the necessary data to your database*/}
            {/*            console.log(res);*/}
            {/*        }*/}
            {/*    }}*/}
            {/*>*/}
            {/*    Upload*/}
            {/*</button>*/}
        </div>
    );
}