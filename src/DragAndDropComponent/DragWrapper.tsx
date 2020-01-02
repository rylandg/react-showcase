import React, { CSSProperties } from 'react';

import './DragAndDropComponent.scss';

export interface DragWrapperProps {
  id: string;
  setDragId: (id: string | undefined) => void;
  isAbsPos?: boolean;
  offsetX?: number;
  offsetY?: number;
}

export const DragWrapper: React.FC<DragWrapperProps> = ({
  children,
  id,
  isAbsPos,
  setDragId,
  offsetX,
  offsetY,
}) => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    setDragId(id);
    const dragEle = document.getElementById(id);
    if (dragEle === null) return;

    const style = window.getComputedStyle(dragEle, null);
    console.log(style.position);
    if (style.position !== 'absolute') {
      const bounding = dragEle.getBoundingClientRect();
      const pTop = bounding.top - event.clientY;
      const pLeft = bounding.left - event.clientX;
      const offsetAmt = (pLeft) + ',' + (pTop);
      event.dataTransfer.setData('text/plain', offsetAmt);
    } else {
      const left = parseInt(style.getPropertyValue('left'), 10);
      const top = parseInt(style.getPropertyValue('top'), 10);
      const offsetAmt = (left - event.clientX) + ',' + (top - event.clientY);
      event.dataTransfer.setData('text/plain', offsetAmt);
    }
  }
  const onDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    setDragId(undefined);
  }

  const absStyles = {
    left: offsetX || 0,
    top: offsetY || 0,
    position: 'absolute',
    zIndex: 1000,
  } as CSSProperties;

  const style = isAbsPos ? absStyles : {
    left: 0,
    top: 0,
  } as CSSProperties;

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

