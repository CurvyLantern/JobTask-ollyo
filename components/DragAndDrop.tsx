import {
  DndContext,
  closestCenter,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragCancelEvent,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import ImageWrapper from "./ImageWrapper";
import SortableItem from "./SortableItem";
import { useId } from "react";
import { ImageItems } from "@/pages";

type DragAndDropProps = {
  handleDragStart: (evt: DragStartEvent) => void;
  handleDragEnd: (evt: DragEndEvent) => void;
  handleDragCancel: (evt: DragCancelEvent) => void;
  dragActiveIndex: number | null;
  items: ImageItems;
  toggleSelection: (id: string | number) => void;
};
const DragAndDrop = ({
  handleDragCancel,
  handleDragEnd,
  handleDragStart,
  dragActiveIndex,
  items,
  toggleSelection,
}: DragAndDropProps) => {
  const dndContextId = useId();
  // const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 500,
        tolerance: 5,
      },
    })
  );
  return (
    <DndContext
      id={dndContextId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}>
      <SortableContext
        items={items}
        strategy={rectSortingStrategy}>
        <div className="image__grid">
          {items.map((imageItem, imageItemIndex) => {
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
          <ImageWrapper {...items[dragActiveIndex]} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DragAndDrop;
