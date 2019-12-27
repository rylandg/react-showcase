import '@reshuffle/code-transform/macro';
import React, { MouseEvent, DragEvent, useState, useEffect } from 'react';
import { RouteProps, Redirect } from 'react-router-dom';
import uuidv4 from 'uuid';
import qs from 'qs';

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

interface DragAndDropDisplayProps {
  pageId: string;
}
// this is both our wrapper and a very simple example
export const DragAndDropDisplay: React.FC<DragAndDropDisplayProps> = ({ pageId }) => {
  const [isValidId, setIsValidId] = useState<boolean | undefined>(undefined);
  const [ornaments, setOrnaments] = useState<SavedOrnament[]>(createInitialOrnaments());
  const [dragId, setDragId] = useState<string | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function loadOrnaments() {
      const remoteOrnaments = await getRemoteOrnaments(pageId);
      if (!remoteOrnaments || remoteOrnaments.length === 0) {
        setIsValidId(false);
      } else {
        setIsValidId(true);
        setOrnaments(remoteOrnaments);
      }
    }
    loadOrnaments();
  }, []);
  if (isValidId === undefined) {
    return null;
  } else if (isValidId === false) {
    return <Redirect to='/drag-and-drop'/>;
  }

  const setAndSave = async (orns: SavedOrnament[]) => {
    setOrnaments(orns);
    await saveRemoteOrnaments(pageId, orns);
  }

  const removeOrnamentById = (removeId: string): boolean => {
    if (dragId === removeId) {
      setDragId(undefined);
    }
    const removedOrnament = ornaments.filter(({ id }) =>
      id === removeId);
    if (removedOrnament.length && !removedOrnament[0].duplicator) {
      const notRemovedOrnaments = ornaments.filter(({ id }) =>
        id !== removeId);
      setAndSave(notRemovedOrnaments);
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

      setAndSave(copy);
      // saveOrnaments(copy);
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

export const DragAndDropChooser: React.FC = () => {
  const [createdId, setCreatedId] = useState<string | undefined>(undefined);
  const createNew = async (event: MouseEvent) => {
    event.preventDefault();
    const newId = uuidv4();
    await saveRemoteOrnaments(newId, createInitialOrnaments());
    setCreatedId(newId);
  }
  if (createdId) {
    return <Redirect to={`/drag-and-drop?id=${createdId}`}/>;
  }
  return (
    <div>
      <button onClick={createNew}>
        Create new tree
      </button>
    </div>
  );
}

export const DragAndDropComponent: React.FC<RouteProps> = ({ location }) => {
  const queryParams = location && location.search;
  if (!queryParams) {
    return <DragAndDropChooser/>;
  }

  const qp = qs.parse(queryParams, { ignoreQueryPrefix: true });
  if (!qp.id) {
    return <DragAndDropChooser/>;
  }

  return <DragAndDropDisplay pageId={qp.id}/>;
}