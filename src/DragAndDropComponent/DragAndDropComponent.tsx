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

import './DragAndDropComponent.scss';                                           // these are just a bunch of imports we need for the code

const ornamentKey = 'temp';                                                     // create a variable ornamentKey = 'temp'

const saveOrnaments = (ornaments: SavedOrnament[]) => {                         // a function called saveOrnaments which equals ornaments of type SavedOrnaments[]. 
  localStorage.setItem(ornamentKey, JSON.stringify(ornaments));                 // we use local storage and the setItem function to save the ornaments to local storage
}

const createInitialOrnaments = (): SavedOrnament[] => {                         // A function which creates the 'menu' ornaments and we store them in an array 
  const ornaments: SavedOrnament[] = [];
  const orn = [...Array(1)];

  ornaments.push({                                                              // Ornaments are drawn to the screen here
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


const getSavedOrnaments = (): SavedOrnament[] => {                              // function called getSavedOrnaments which is type savedOrnament[]
  const maybeOrnaments = localStorage.getItem(ornamentKey);                     // Use local storage to retrieve ornaments and call it maybeOrnaments
  if (maybeOrnaments !== null) {                                                // check if maybe is not null, then parse maybeOrnaments
    return JSON.parse(maybeOrnaments);
  }
  return createInitialOrnaments();
}


interface RecycleBinProps {                                                     // This allows us to drag an ornament to the recycle bit to remove the ornament from the screen
  onDrop?: (evt: DragEvent<HTMLDivElement>) => void;
}

const RecycleBin: React.FC<RecycleBinProps> = ({ onDrop }) => {                 // Makes the recycle bin work
  return (
    <div className='recycle-wrapper'>
      <img
        src={Recycle}
        className='recycle'
        onDrop={onDrop}
      />
      <div className='recycle-spacer' />
    </div>
  );
}

interface DragAndDropDisplayProps {                                             // helper for DragAndDropDisplay
  pageId: string;
}
// this is both our wrapper and a very simple example
export const DragAndDropDisplay: React.FC<DragAndDropDisplayProps> = ({ pageId }) => {        // Create array with 2 items: isValidId and setIsValidId
  const [isValidId, setIsValidId] = useState<boolean | undefined>(undefined);                 // Create array by accessing useState< >
  const [ornaments, setOrnaments] = useState<SavedOrnament[]>(createInitialOrnaments());
  const [dragId, setDragId] = useState<string | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const runOnce = () => {                                                       // this function only runs on the first render
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
  }
  useEffect(runOnce, []);


  if (isValidId === undefined) {
    return null;
  } else if (isValidId === false) {
    return <Redirect to='/drag-and-drop' />;
  }

  const setAndSave = async (orns: SavedOrnament[]) => {                         // this saves the ornaments to the current spot
    setOrnaments(orns);
    await saveRemoteOrnaments(pageId, orns);
  }

  const removeOrnamentById = (removeId: string): boolean => {                   // remove an ornament by its ID
    if (dragId === removeId) {
      setDragId(undefined);
    }
    const removedOrnament = ornaments.filter(({ id }) =>                        // use filter to get the ornaments by ID 
      id === removeId);
    if (removedOrnament.length && !removedOrnament[0].duplicator) {
      const notRemovedOrnaments = ornaments.filter(({ id }) =>
        id !== removeId);
      setAndSave(notRemovedOrnaments);
      return true;
    }
    return false;
  }

  document.addEventListener('keydown', ({ key }) => {                           // pressing backspace will delete the selected ornament
    if (key === 'Backspace') {
      if (selectedId) {
        const removed = removeOrnamentById(selectedId);
        setSelectedId(undefined);
      }
    }
  });

  const onDrag = (event: React.DragEvent<HTMLDivElement>) => {                  // helper function
    event.preventDefault();
  }

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {              // helper function
    event.preventDefault();
    return false;
  }

  const onDrop = async (event: DragEvent<HTMLDivElement>) => {                  // onDrop function async function 
    event.preventDefault();                                                      
    const offset = event.dataTransfer.getData('text/plain').split(',');         // splits offsets xy to x, y
    const dragEle = document.getElementById(dragId || uuidv4());                // uses function uuidv4 to assign an id or uses current id (dragId) to get the ID
    if (dragEle !== null) {
      const xOff = parseInt(offset[0], 10);                                     // offset of dragging x and y since mouse curser isn't always at origin of ornament
      const yOff = parseInt(offset[1], 10);
      const copy = [...ornaments];                                              // copy ornaments array to a variable called copy
      const targetElement = copy.filter(({ id }) => id === dragId)[0];          // filter ornaments by id
      if (targetElement.duplicator) {                                           // check if the ornament is a duplicator
        const copyOrnament = {                                                  // if it is, change the properties of the current ornament and set duplicator to false
          ...targetElement,
          id: uuidv4(),
          left: event.clientX + xOff,
          top: event.clientY + yOff,
          duplicator: false,
        };
        copy.push(copyOrnament);                                                // add the ornament to the copy array
      } else {
        targetElement.left = event.clientX + xOff;                              // if the ornament isn't a duplicator, don't change any properties
        targetElement.top = event.clientY + yOff;                               // and update the ornament's top and left 
      }

      setAndSave(copy);                                                         // call setAndSave function with the copy array
      // saveOrnaments(copy);                                                   // the copy array is now saved
    }
    return false;
  }

  const onRecycleDrop = async (event: DragEvent<HTMLDivElement>) => {           // if you drop an ornament on the recycle bin, the ornament will be deleted
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
      className='dnd-container'                                                 // everything is wrapped in the dnd-container
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDrag={onDrag}
    >
       <img src={Tree} className='tree' />                                      {/* draws tree */}
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
      <RecycleBin onDrop={onRecycleDrop} />
    </div>
  );
}

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
    return <Redirect to={`/drag-and-drop?id=${createdId}`} />;
  }
  return (
    <div className='centered-wrapper'>
      <div className='centered-list-spacer' />
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
      <div className='centered-list-spacer' />
    </div>
  );
}

export const DragAndDropComponent: React.FC<RouteProps> = ({ location }) => {
  const queryParams = location && location.search;
  if (!queryParams) {
    return <DragAndDropChooser />;
  }

  const qp = qs.parse(queryParams, { ignoreQueryPrefix: true });
  if (!qp.id) {
    return <DragAndDropChooser />;
  }

  return <DragAndDropDisplay pageId={qp.id} />;
}
