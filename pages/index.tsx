import Dropzone from "@/components/Dropzone";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { useCallback, useState } from "react";

import DragAndDrop from "@/components/DragAndDrop";
import Head from "next/head";
import { mockImageList } from "@/mock/imageList.mock";
import { randomId } from "@/utils/randomId";

type ImageItem = {
  id: string;
  src: string;
  isSelected: boolean;
};
export type ImageItems = ImageItem[];

export default function HomePage({ imageList }: { imageList: ImageItems }) {
  const [droppedImages, setDroppedImages] = useState<ImageItems>(imageList);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const files = acceptedFiles.map((file) => ({
      id: randomId(),
      src: URL.createObjectURL(file),
      isSelected: false,
    }));
    setDroppedImages((p) => [...p, ...files]);
  }, []);

  const onDeleteSelected = () => {
    setDroppedImages(droppedImages.filter((item) => !item.isSelected));
  };

  // Find which items are selected
  // and toggle their selected state
  const toggleSelection = useCallback((id: string | number) => {
    setDroppedImages((p) => {
      const item = p.find((item) => item.id === id);
      if (item) {
        item.isSelected = !item.isSelected;
      }
      return [...p];
    });
  }, []);

  const totalImageSelected = droppedImages.filter(
    (item) => item.isSelected
  ).length;

  const [dragActiveIndex, setDragActiveIndex] = useState<number | null>(null);
  const handleDragStart = (event: DragStartEvent) => {
    setDragActiveIndex(event.active.data.current?.sortable.index);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over) {
      // active id = over id means item wasn't moved to other place
      if (active.id !== over.id) {
        setDroppedImages((p) => {
          const oldIndex = active.data.current?.sortable.index;
          const newIndex = over.data.current?.sortable.index;

          return arrayMove(p, oldIndex, newIndex);
        });
      }
      setDragActiveIndex(null);
    }
  };
  const handleDragCancel = () => {
    setDragActiveIndex(null);
  };
  return (
    <>
      <Head>
        <title>A draggable image gallery</title>
      </Head>
      <main className="py-20 flex flex-col gap-10">
        <div className="max-w-md  mx-auto px-5">
          <Dropzone onDrop={onDrop} />
        </div>
        <div className=" max-w-6xl  mx-auto flex flex-col gap-5 px-5">
          <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
            <p className="font-semibold text-xl">
              Images selected {totalImageSelected}
            </p>
            <button
              onClick={onDeleteSelected}
              type="button"
              disabled={totalImageSelected <= 0}
              className="py-1 px-3 text-xs rounded-md bg-red-500 text-white hover:bg-red-600 enabled:active:translate-y-1 transition-transform
            disabled:bg-neutral-400 transition-none">
              Delete Selected
            </button>
          </div>
          <p className="text-center text-lg font-semibold text-red-400">
            Tap and hold to drag an image
          </p>
          <div className="flex">
            {/* these are helpful for mobile devices to scroll viewport */}
            <div className="px-3 sm:hidden"></div>
            <DragAndDrop
              dragActiveIndex={dragActiveIndex}
              handleDragCancel={handleDragCancel}
              handleDragEnd={handleDragEnd}
              handleDragStart={handleDragStart}
              items={droppedImages}
              toggleSelection={toggleSelection}
            />
            {/* these are helpful for mobile devices to scroll viewport */}
            <div className="px-3 sm:hidden"></div>
          </div>
        </div>
      </main>
    </>
  );
}

export function getServerSideProps() {
  return {
    props: {
      imageList: mockImageList,
    },
  };
}
