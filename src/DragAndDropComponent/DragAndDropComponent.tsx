import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import uuidv4 from 'uuid';

import { saveRemoteOrnaments, getRemoteOrnaments } from '../../backend/backend';

import BlueOrnament from './blue-ornament.png';
import GoldOrnament from './gold-ornament.png';
import GreenishOrnament from './greenish-ornament.png';
import GreenBowOrnament from './green-ornament.png';
import Tree from './tree.png';
import Star from './star.png';
import RedOrnament from './red-ornament.png';
import LightsString from './lights-string.jpg';
import ColoredLights from './colored-lights.png';
import WhiteLights from './white-lights.png';
import WhiteLightsSmall from './white-lights-small.png';
import Greeting from 'text-greeting.png';

import './DragAndDropComponent.scss';
import { start } from 'repl';
import { create } from 'istanbul-reports';

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
  Red = 'Red',
  GreenBow = 'GreenBow',
  Star = 'Star',
  WhiteLights = 'WhiteLights',
  ColoredLights = 'ColoredLights',
  LightsString= 'LightsString',
  WhiteLightsSmall = 'WhiteLightsSmall',
  // Greeting = 'Greeting',
}

interface SavedOrnament {
  id: string;
  type: OrnamentType;
  top: number;
  left: number;
  duplicator?: boolean;

}

interface OrnamentProps extends DragWrapperProps {
  ornament: SavedOrnament;
}

const OrnamentImages = {
  [OrnamentType.Blue]: BlueOrnament,
  [OrnamentType.Greenish]: GreenishOrnament,
  [OrnamentType.GreenBow]: GreenBowOrnament,
  [OrnamentType.Gold]: GoldOrnament,
  [OrnamentType.Star]: Star,
  [OrnamentType.Red]: RedOrnament,
  [OrnamentType.ColoredLights]: ColoredLights,
  [OrnamentType.WhiteLights]: WhiteLights,
  [OrnamentType.LightsString]: LightsString,
  [OrnamentType.WhiteLightsSmall]: WhiteLightsSmall,
};

const getClassFromOrnamentType = (ornamentType: OrnamentType): string => {
  const lightTypes = [OrnamentType.ColoredLights, OrnamentType.WhiteLights]
  const starType = OrnamentType.Star;
  const smallLightsType = OrnamentType.WhiteLightsSmall;
  if (lightTypes.includes(ornamentType)) {
    return 'lights';
  }
  if (ornamentType === starType) {
    return 'star';
  }
  if (ornamentType === smallLightsType) {
    return 'lights-small'
  }
  return 'ornament';
}

const Ornament: React.FC<OrnamentProps> = ({
  ornament,
  ...rest
}) => {
  const { id, top, left, type, } = ornament;
  const className = getClassFromOrnamentType(type);
  return (
    <DragWrapper
      id={id}
      offsetY={top}
      offsetX={left}
      {...rest}
    >
      <img
        className={className}
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
  const orn = [...Array(1)];

  ornaments.push({
    type: OrnamentType.WhiteLights,
    id: uuidv4(),
    top: 310,
    left: 15,
    duplicator: true,
  });

  ornaments.push({
    type: OrnamentType.ColoredLights,
    id: uuidv4(),
    top: 385,
    left: 15,
    duplicator: true,
  });

  ornaments.push({
    type: OrnamentType.WhiteLightsSmall,
    id: uuidv4(),
    top: 385,
    left: 15,
    duplicator: true,
  });

  ornaments.push({
    type: OrnamentType.Gold,
    id: uuidv4(),
    top: 10,
    left: 15,
    duplicator: true,
  });

  ornaments.push({
    type: OrnamentType.Blue,
    id: uuidv4(),
    top: 85,
    left: 15,
    duplicator: true,
  });

  ornaments.push({
    type: OrnamentType.Greenish,
    id: uuidv4(),
    top: 160,
    left: 15,
    duplicator: true,
  });

  ornaments.push({
    type: OrnamentType.Red,
    id: uuidv4(),
    top: 235,
    left: 15,
    duplicator: true,
  });

  ornaments.push({
    type: OrnamentType.Star,
    id: uuidv4(),
    top: 435,
    left: 15,
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
  const [ornaments, setOrnaments] = useState<SavedOrnament[]>(createInitialOrnaments());
  // useEffect(() => {
  //   async function loadOrnaments() {
  //     const remoteOrnaments = await getRemoteOrnaments();
  //     if (remoteOrnaments === undefined || remoteOrnaments.length === 0) {
  //       setOrnaments(createInitialOrnaments);
  //     } else {
  //       setOrnaments(remoteOrnaments);
  //     }
  //   }
  //   loadOrnaments();
  // }, []);
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
      const targetElement = copy.filter(({ id }) => id === dragId)[0];
      if (targetElement.duplicator) {
        const copyOrnament = {
          ...targetElement,
          id: uuidv4(),
          left: event.clientX + xOff,
          top: event.clientY + yOff,
          duplicator: false,
        };
        copy.push(copyOrnament);
      } else {
        targetElement.left = event.clientX + xOff;
        targetElement.top = event.clientY + yOff;
      }
     
      setOrnaments(copy);
      // saveOrnaments(copy);
      await saveRemoteOrnaments(copy);
    }
    return false;
  }

  class MyForm extends React.Component {
    render() {
      return (
        <form>
          <h1>Hello</h1>
          <p>Enter your name:</p>
          <input
            type="text"
          />
        </form>
      );
    }
  }

  return (
    <div
      className='dnd-container'
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDrag={onDrag}
    >
      <img src={Tree} className="tree"  />
      <div className='menu'> </div>
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
