import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import uuidv4 from 'uuid';

import { saveRemoteOrnaments, getRemoteOrnaments } from '../../backend/backend';

import BlueOrnament from './blue-ornament.png';
import GoldOrnament from './gold-ornament.png';
import GreenishOrnament from './greenish-ornament.png';
import GreenBowOrnament from './green-ornament.png';
import Tree from './tree.png';

import './DragAndDropComponent.scss';

interface DragWrapperProps {
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

enum OrnamentType {
  Blue = 'Blue',
  Greenish = 'Greenish',
  Gold = 'Gold',
  GreenBow = 'GreenBow',
}

interface SavedOrnament {
  id: string;
  type: OrnamentType;
  top: number;
  left: number;
}

interface OrnamentProps extends DragWrapperProps {
  ornament: SavedOrnament;
}

const OrnamentImages = {
  [OrnamentType.Blue]: BlueOrnament,
  [OrnamentType.Greenish]: GreenishOrnament,
  [OrnamentType.GreenBow]: GreenBowOrnament,
  [OrnamentType.Gold]: GoldOrnament,
};

const Ornament: React.FC<OrnamentProps> = ({
  ornament,
  ...rest
}) => {
  const { id, top, left, type } = ornament;
  return (
    <DragWrapper
      id={id}
      offsetY={top}
      offsetX={left}
      {...rest}
    >
      <img
        className='ornament'
        src={OrnamentImages[type]}
      />
    </DragWrapper>
  );
}

const ornamentKey = 'temp';

const saveOrnaments = (ornaments: SavedOrnament[]) => {
  localStorage.setItem(ornamentKey, JSON.stringify(ornaments));
}

const createInitialOrnaments = (): SavedOrnament[] => {
  const ornaments: SavedOrnament[] = [];
  const orn = [...Array(3)];

  orn.map((_, idx) => {
    ornaments.push({
      type: OrnamentType.Gold,
      id: uuidv4(),
      top: idx * 75,
      left: 0,
    });
  });

  orn.map((_, idx) => {
    ornaments.push({
      type: OrnamentType.Blue,
      id: uuidv4(),
      top: idx * 75,
      left: 75,
    });
  });

  orn.map((_, idx) => {
    ornaments.push({
      type: OrnamentType.Greenish,
      id: uuidv4(),
      top: idx * 75,
      left: 150,
    });
  });
  return ornaments;
}

const getSavedOrnaments = (): SavedOrnament[] => {
  const maybeOrnaments = localStorage.getItem(ornamentKey);
  if (maybeOrnaments !== null) {
    return JSON.parse(maybeOrnaments);
  }
  return createInitialOrnaments();
}

// this is both our wrapper and a very simple example
export const DragAndDropComponent: React.FC = () => {
  const [ornaments, setOrnaments] = useState<SavedOrnament[]>([]);
  useEffect(() => {
    async function loadOrnaments() {
      const remoteOrnaments = await getRemoteOrnaments();
      if (remoteOrnaments === undefined || remoteOrnaments.length === 0) {
        setOrnaments(createInitialOrnaments);
      } else {
        setOrnaments(remoteOrnaments);
      }
    }
    loadOrnaments();
  }, []);
  const [dragId, setDragId] = useState<string | undefined>(undefined);

  const onDrag = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    return false;
  }

  const onDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const offset = event.dataTransfer.getData('text/plain').split(',');
    const dragEle = document.getElementById(dragId || uuidv4());
    if (dragEle !== null) {
      const xOff = parseInt(offset[0], 10);
      const yOff = parseInt(offset[1], 10);
      const copy = [...ornaments];
      copy.forEach((ornament) => {
        if (ornament.id === dragId) {
          ornament.left = event.clientX + xOff;
          ornament.top = event.clientY + yOff;
        }
      });
      setOrnaments(copy);
      // saveOrnaments(copy);
      await saveRemoteOrnaments(copy);
    }
    return false;
  }

  return (
    <div
      className='dnd-container'
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDrag={onDrag}
    >
      <img src={Tree} />
      {
        ornaments.map((ornament) => (
          <Ornament
            key={ornament.id}
            id={ornament.id}
            ornament={ornament}
            setDragId={setDragId}
          />
        ))
      }
    </div>
  );
}
