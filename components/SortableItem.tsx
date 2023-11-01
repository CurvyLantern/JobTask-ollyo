/* eslint-disable @next/next/no-img-element */
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties, HTMLAttributes, forwardRef } from "react";
import Checkbox from "./checkbox/Checkbox";
import ImageWrapper from "./ImageWrapper";

type ItemProps = {
  id: string;
  src: string;
  isSelected: boolean;
  isFeatured: boolean;
  toggleSelection: (id: string | number) => void;
};

const SortableItem = (props: ItemProps) => {
  const {
    attributes,
    listeners,
    isDragging,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: props.id,
    transition: {
      duration: 300,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
    data: {
      itemId: props.id,
    },
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    transformOrigin: "0 0 ",
  };
  return (
    <Item
      ref={setNodeRef}
      style={style}
      isDragging={isDragging}
      {...attributes}
      {...listeners}
      {...props}
    />
  );
};

type Props = ItemProps &
  HTMLAttributes<HTMLDivElement> & {
    isDragging: boolean;
  };
export const Item = forwardRef<HTMLDivElement, Props>(function Item(
  { isSelected, style, isDragging, isFeatured, toggleSelection, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`relative rounded-md shadow-sm
      touch-none
      ${isFeatured ? " col-span-1 md:col-span-2 row-span-2 " : ""}
      ${isDragging ? " opacity-25 cursor-grabbing" : "cursor-grab opacity-100"}
      `}
      style={style}
      {...props}>
      <ImageWrapper src={props.src} />
      {!isDragging ? (
        <div className="absolute top-0 left-0 p-3 ">
          <Checkbox
            checked={isSelected}
            onChange={() => {
              toggleSelection(props.id);
            }}
          />
        </div>
      ) : null}
    </div>
  );
});

export default SortableItem;
