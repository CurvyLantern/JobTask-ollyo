import React from "react";
import { useDropzone } from "react-dropzone";
import { TbPhotoUp } from "react-icons/tb";

type DropZoneProps = {
  onDrop: (file: File[]) => void;
};
const Dropzone = ({ onDrop }: DropZoneProps) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDropAccepted: onDrop,
    accept: {
      "image/*": [],
    },
  });

  return (
    <div
      className="p-5 rounded-md border-2 shadow-sm bg-white border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 h-64"
      {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="text-4xl">
        <TbPhotoUp />
      </div>

      <p className="text-center">Drop images here or click to select image</p>
    </div>
  );
};

export default Dropzone;
