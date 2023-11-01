import Dropzone from "@/components/Dropzone";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { nanoid } from "nanoid";

const randomId = () => nanoid();
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
  DragStartEvent,
  UniqueIdentifier,
  DragEndEvent,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import SortableItem, { Item } from "@/components/SortableItem";
import ImageWrapper from "@/components/ImageWrapper";
import Head from "next/head";

type ImageItem = {
  id: string;
  src: string;
  isSelected: boolean;
};
type ImageItems = ImageItem[];

export default function HomePage({ imageList }: { imageList: ImageItems }) {
  const [droppedImages, setDroppedImages] = useState<ImageItems>(imageList);

  // const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 500,
        tolerance: 5,
      },
    })
  );

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
    console.log("I am executing");
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
  const dndContextId = useId();
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
          <p className="text-center">Tap and hold to drag an image</p>
          <div className="flex">
            <div className="px-3 sm:hidden"></div>
            <DndContext
              id={dndContextId}
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}>
              <SortableContext
                items={droppedImages}
                strategy={rectSortingStrategy}>
                <div className="image__grid">
                  {droppedImages.map((imageItem, imageItemIndex) => {
                    const isFeatured = imageItemIndex === 0;
                    return (
                      <SortableItem
                        key={imageItem.id}
                        {...imageItem}
                        isFeatured={isFeatured}
                        toggleSelection={toggleSelection}
                      />
                    );
                  })}
                </div>
              </SortableContext>
              <DragOverlay
                adjustScale
                dropAnimation={{
                  duration: 300,
                  easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
                }}
                modifiers={[restrictToWindowEdges]}>
                {typeof dragActiveIndex === "number" && dragActiveIndex >= 0 ? (
                  <ImageWrapper {...droppedImages[dragActiveIndex]} />
                ) : null}
              </DragOverlay>
            </DndContext>
            <div className="px-3 sm:hidden"></div>
          </div>
        </div>
      </main>
    </>
  );
}

export function getServerSideProps() {
  const imageList = [
    {
      id: randomId(),
      src: "https://images.pexels.com/photos/17811/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      isSelected: false,
    },
    {
      id: randomId(),
      src: "https://images.pexels.com/photos/1059823/pexels-photo-1059823.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      isSelected: false,
    },
    {
      id: randomId(),
      src: "https://images.pexels.com/photos/731706/pexels-photo-731706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      isSelected: false,
    },
    {
      id: randomId(),
      src: "https://images.pexels.com/photos/145378/pexels-photo-145378.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      isSelected: false,
    },
    {
      id: randomId(),
      src: "https://images.pexels.com/photos/689784/pexels-photo-689784.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      isSelected: false,
    },
    {
      id: randomId(),
      src: "https://images.pexels.com/photos/1013335/pexels-photo-1013335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      isSelected: false,
    },
    {
      id: randomId(),
      src: "https://images.pexels.com/photos/11064121/pexels-photo-11064121.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      isSelected: false,
    },
    {
      id: randomId(),
      src: "https://images.pexels.com/photos/11025915/pexels-photo-11025915.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      isSelected: false,
    },
    {
      id: randomId(),
      src: "https://images.pexels.com/photos/1156507/pexels-photo-1156507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      isSelected: false,
    },
  ];
  return {
    props: {
      imageList,
    },
  };
}
