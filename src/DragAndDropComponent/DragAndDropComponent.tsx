import '@reshuffle/code-transform/macro';
import React, { MouseEvent, DragEvent, useState, useEffect } from 'react';
import { RouteProps, Redirect, Link } from 'react-router-dom';
import uuidv4 from 'uuid';
import qs from 'qs';

import {
  saveRemoteOrnaments,
  getRemoteOrnaments,
  getAllTrees,
} from '../../backend/backend';
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

  // ornaments.push({
  //   type: OrnamentType.WhiteLights,
  //   id: uuidv4(),
  //   top: 310,
  //   left: 15,
  //   duplicator: true,
  // });

  // ornaments.push({
  //   type: OrnamentType.ColoredLights,
  //   id: uuidv4(),
  //   top: '70%',
  //   left: 15,
  //   duplicator: true,
  // });

  // ornaments.push({
  //   type: OrnamentType.WhiteLightsSmall,
  //   id: uuidv4(),
  //   top: '60%',
  //   left: '5%',
  //   duplicator: true,
  // });

  ornaments.push({
    type: OrnamentType.Gold,
    id: uuidv4(),
    top: '3vh',
    left: '5%',
    duplicator: true,
  });

  // ornaments.push({
  //   type: OrnamentType.Blue,
  //   id: uuidv4(),
  //   top: '14vh',
  //   left: '5%',
  //   duplicator: true,
  // });

  // ornaments.push({
  //   type: OrnamentType.Greenish,
  //   id: uuidv4(),
  //   top: '26vh',
  //   left: '5%',
  //   duplicator: true,
  // });

  // ornaments.push({
  //   type: OrnamentType.Red,
  //   id: uuidv4(),
  //   top: '38vh',
  //   left: '5%',
  //   duplicator: true,
  // });

  // ornaments.push({
  //   type: OrnamentType.Star,
  //   id: uuidv4(),
  //   top: '70%',
  //   left: 15,
  // });

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
  const [isValidId, setIsValidId] = useState<boolean | undefined>(true);
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

  // window.addEventListener("drop", (e) => {
  //   e.preventDefault();
  // }, false);

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
    const dropZone = document.getElementById('droppable-zone');
    if (dragEle !== null && dropZone !== null) {
      const xOff = parseInt(offset[0], 10);
      const yOff = parseInt(offset[1], 10);
      console.log(`x offset ${xOff}`);
      console.log(`y offset ${yOff}`);
      console.log(`client x ${event.clientX}`);
      console.log(`client y ${event.clientY}`);
      console.log(`final x ${event.clientX + xOff}`);
      console.log(`final y ${event.clientY + yOff}`);
      const fullX = event.clientX + xOff;
      const fullY = event.clientY + yOff;
      const wHeight = window.innerHeight;
      const yVh = (fullY / dropZone.offsetHeight) * 100;
      console.log(`percent y ${yVh}`);
      console.log(dropZone.getBoundingClientRect());
      console.log(`drop zone left offset ${dropZone.offsetLeft}`);
      const xVw = (fullX / dropZone.offsetWidth);
      console.log(`percent x ${xVw}`);
      const actualX = (event.clientX - dropZone.offsetLeft + xOff);
      const percentX = (actualX / dropZone.offsetWidth) * 100;
      const copy = [...ornaments];
      const targetElement = copy.filter(({ id }) => id === dragId)[0];
      if (targetElement.duplicator) {
        const copyOrnament = {
          ...targetElement,
          id: uuidv4(),
          top: `${yVh}%`,
          left: `${percentX}%`,
          duplicator: false,
        };
        copy.push(copyOrnament);
      } else {
        // targetElement.left = event.clientX + xOff;
        targetElement.left = `${percentX}%`;
        targetElement.top = `${yVh}%`;
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
    <div className='dnd-container'>
      <div className='menu'> </div>
      <div
        className='droppable-wrapper'
        id='droppable-zone'
      >
        <div
          className='droppable-zone'
          onDragOver={onDragOver}
          onDrop={onDrop}
          onDrag={onDrag}
        >
          <div className='drag-zone-wrapper'>
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
          </div>
          <img
            src={Tree}
            className='tree'
            id='drop-tree'
          />
        </div>
        {/* <RecycleBin onDrop={onRecycleDrop}/> */}
      </div>
    </div>
  );
}
       // {
       //    ornaments.map((ornament) => (
       //      <Ornament
       //        key={ornament.id}
       //        id={ornament.id}
       //        ornament={ornament}
       //        setDragId={setDragId}
       //        selectedId={selectedId}
       //        setSelectedId={setSelectedId}
       //      />
       //    ))
       //  }


export const DragAndDropChooser: React.FC = () => {
  const [createdId, setCreatedId] = useState<string | undefined>(undefined);
  const [existingIds, setExistingIds] = useState<string[]>([]);
  useEffect(() => {
    async function loadExistingTrees() {
      const trees = await getAllTrees();
      setExistingIds(trees);
    }
    loadExistingTrees();
  }, []);
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
    <div className='centered-wrapper'>
      <div className='centered-list-spacer'/>
      <div className='centered-list-container'>
        <div className='centered-list-controls'>
          <div className='centered-list-controls-button-wrapper'>
            <button
              onClick={createNew}
              className='centered-list-controls-button'
            >
              Create new tree
            </button>
          </div>
        </div>
          {
            existingIds.map((existingId) => (
              <Link
                to={`/drag-and-drop?id=${existingId}`}
                className='centered-list-content-link'
                key={existingId}
              >
                <div className='centered-list-content-item'>
                    {existingId}
                </div>
              </Link>
            ))
          }
      </div>
      <div className='centered-list-spacer'/>
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
