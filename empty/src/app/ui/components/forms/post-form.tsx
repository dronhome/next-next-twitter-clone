"use client"

import React, {ChangeEvent, FormEvent} from "react";
import TextInputField from "@/app/ui/components/input-components/sm-text-input-filed";
import TextareaField from "@/app/ui/components/input-components/lg-text-input-field";
import ImageUploader from "@/app/ui/components/input-components/image-filed";

interface Props {
    formData: { title: string; body: string; image: string };
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    pending: boolean;
    errors: Record<string, string[]> | undefined;
    file: File | null;
    setFile: (file: File | null) => void;
    handleImageChange: (image: string) => void;
}

export default function PostForm({ formData, onChange, onSubmit, pending, errors, file, setFile, handleImageChange }: Props) {
    return (
      <form onSubmit={onSubmit} className={"flex flex-col gap-3"}>
          <div className="relative w-full h-full">
              {!formData.image &&
                  <p className="absolute pt-3 pl-4 z-1 text-white/50">Image:</p>
              }
              <ImageUploader
                  url={formData.image}
                  file={file}
                  setUrl={handleImageChange}
                  setFile={setFile}
                  isPfp={false}
                  className="mb-3"
              />
          </div>
          <TextInputField
              label="Title"
              name="title"
              value={formData.title}
              onChange={onChange}
              placeholder={""}
              errorMessages={errors?.title}
          />
          <TextareaField
              label="Body"
              name="body"
              value={formData.body}
              onChange={onChange}
              maxLength={1000}
              placeholder=""
              showCounter={true}
              errorMessages={errors?.body}
          />
          {/**/}
          {errors?.image?.map((msg, i) => (
              <p key={i} className="text-red-600 text-sm mt-1">{msg}</p>
          ))}
          {/**/}
          <div className="flex justify-end">
              <button
                  type="submit"
                  disabled={pending}
                  className="btn"
              >
                  {pending ? "Saving…" : "Create Post"}
              </button>
          </div>

      </form>
    );
}