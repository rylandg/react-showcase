import React from 'react';

import './DragAndDropComponent.scss';

export interface DragWrapperProps {
  id: string;
  setDragId: (id: string | undefined) => void;
  offsetX?: number;
  offsetY?: number;
}

export const DragWrapper: React.FC<DragWrapperProps> = ({
  children,
  id,
  setDragId,
  offsetX,
  offsetY,
}) => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    setDragId(id);
    const dragEle = document.getElementById(id);
    if (dragEle === null) return;

    const style = window.getComputedStyle(dragEle, null);
    const left = parseInt(style.getPropertyValue('left'), 10);
    const top = parseInt(style.getPropertyValue('top'), 10);
    const offsetAmt = (left - event.clientX) + ',' + (top - event.clientY);
    event.dataTransfer.setData('text/plain',
      (left - event.clientX) + ',' + (top - event.clientY));
  }
  const onDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    setDragId(undefined);
  }

  const style = {
    left: offsetX || 0,
    top: offsetY || 0,
  };

  return (
    <div
      id={id}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className='drag-wrapper'
      style={style}
    >
      {children}
    </div>
  );
}

