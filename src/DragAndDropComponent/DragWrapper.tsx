import React from 'react';

import './DragAndDropComponent.scss';

export interface DragWrapperProps {
  id: string;
  setDragId: (id: string | undefined) => void;
  offsetX?: string | number;
  offsetY?: string | number;
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
    const dropZone = document.getElementById('droppable-zone');
    if (dragEle === null || dropZone === null) return;

    const style = window.getComputedStyle(dragEle, null);
    const left = parseInt(style.getPropertyValue('left'), 10);
    const top = parseInt(style.getPropertyValue('top'), 10);
    console.log(`left is ${left} top is ${top}`);
    console.log(`client x ${event.clientX  - dropZone.offsetLeft} client y ${event.clientY}`);
    const offsetAmt = (left - event.clientX) + ',' + (top - event.clientY);
    event.dataTransfer.setData('text/plain',
      (left - (event.clientX - dropZone.offsetLeft)) + ',' + (top - event.clientY));
  }
  const onDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    setDragId(undefined);
  }

  const style = {
    left: offsetX || 0,
    top: offsetY || 0,
  };

  const childrenWithProps = React.Children.map(children, (child: any) =>
    React.cloneElement(child, {
      id,
      draggable: true,
      onDragStart: onDragStart,
      onDragEnd: onDragEnd,
      // className: 'drag-wrapper',
      style,
    })
  );

  return (
    <>
      {childrenWithProps}
    </>
  );
}

