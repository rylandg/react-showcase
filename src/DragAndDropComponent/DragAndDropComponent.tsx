import '@reshuffle/code-transform/macro';
import React, { DragEvent, useState, useEffect } from 'react';
import uuidv4 from 'uuid';

import { saveRemoteOrnaments, getRemoteOrnaments } from '../../backend/backend';
import {
  Ornament,
  SavedOrnament,
  OrnamentType,
} from './Ornament';

import Tree from './tree.png';
import Recycle from './recycle.png';

import './DragAndDropComponent.scss';

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

interface RecycleBinProps {
  onDrop?: (evt: DragEvent<HTMLDivElement>) => void;
}

const RecycleBin: React.FC<RecycleBinProps> = ({ onDrop }) => {
  return (
    <div className='recycle-wrapper'>
      <img
        src={Recycle}
        className='recycle'
        onDrop={onDrop}
      />
      <div className='recycle-spacer'/>
    </div>
  );
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
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const removeOrnamentById = (removeId: string): boolean => {
    if (dragId === removeId) {
      setDragId(undefined);
    }
    const removedOrnament = ornaments.filter(({ id }) =>
      id === removeId);
    if (removedOrnament.length && !removedOrnament[0].duplicator) {
      const notRemovedOrnaments = ornaments.filter(({ id }) =>
        id !== removeId);
      setOrnaments(notRemovedOrnaments);
      return true;
    }
    return false;
  }

  document.addEventListener('keydown', ({ key }) => {
    if (key === 'Backspace') {
      if (selectedId) {
        const removed = removeOrnamentById(selectedId);
        setSelectedId(undefined);
      }
    }
  });

  const onDrag = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    return false;
  }

  const onDrop = async (event: DragEvent<HTMLDivElement>) => {
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

  const onRecycleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const dragEle = document.getElementById(dragId || uuidv4());
    if (dragEle === null || !dragId) {
      return;
    }
    const copy = [...ornaments];
    const targetElement = copy.filter(({ id }) => id === dragId)[0];
    if (targetElement.duplicator) {
      setDragId(undefined);
      return;
    }
    removeOrnamentById(dragId);
  }


  return (
    <div
      className='dnd-container'
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDrag={onDrag}
    >
      <img src={Tree} className='tree'  />
      <div className='menu'> </div>
      {
        ornaments.map((ornament) => (
          <Ornament
            key={ornament.id}
            id={ornament.id}
            ornament={ornament}
            setDragId={setDragId}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        ))
      }
      <RecycleBin onDrop={onRecycleDrop}/>
    </div>
  );
}
