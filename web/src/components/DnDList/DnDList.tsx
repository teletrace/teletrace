import { ReactNode } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvidedDragHandleProps,
  Droppable,
} from "react-beautiful-dnd";

export type DnDItemProps = {
  id: string;
  index: number;
  render: (
    handleProps: DraggableProvidedDragHandleProps | null | undefined
  ) => ReactNode;
};

export const DnDItem = ({ id, index, render }: DnDItemProps) => {
  return (
    <Draggable key={id} draggableId={id} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          {render(provided.dragHandleProps)}
        </div>
      )}
    </Draggable>
  );
};

type DndListProps = {
  droppableId: string;
  children?: ReactNode;
  onMoveItem: (sourceIndex: number, destIndex: number) => void;
};

export const DnDList = ({
  droppableId,
  children,
  onMoveItem,
}: DndListProps) => {
  return (
    <DragDropContext
      onDragEnd={(result) => {
        // dropped outside the list
        if (!result.destination) {
          return;
        }
        onMoveItem(result.source.index, result.destination.index);
      }}
    >
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            // style={getListStyle(snapshot.isDraggingOver)}
          >
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
