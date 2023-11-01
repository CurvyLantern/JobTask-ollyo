/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
const ImageWrapper = ({ src }: { src: string }) => {
  return (
    <div className="w-full h-full rounded-md overflow-hidden ">
      <img
        src={src ? src : "#"}
        alt="Gallery images"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default ImageWrapper;
