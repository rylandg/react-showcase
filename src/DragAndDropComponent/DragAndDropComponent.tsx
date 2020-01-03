import '@reshuffle/code-transform/macro';
import React, {
  MouseEvent,
  DragEvent,
  ChangeEvent,
  useState, 
  useEffect,
} from 'react';
import { RouteProps, Redirect } from 'react-router-dom';
import uuidv4 from 'uuid';
import qs from 'qs';
import { Link } from 'react-router-dom';
import homeButtonImg from './home-button-img.png';

import {
  saveRemoteOrnaments,
  deleteTreeById,
  getRemoteOrnaments,
  getAllTrees,
} from '../../backend/backend';
import {
  Ornament,
  SavedOrnament,
  OrnamentType,
} from './Ornament';

import { TreeRowDisplay } from './TreeRowDisplay';
import { Sidebar } from './Sidebar';

import Tree from './tree.png';
import Recycle from './recycle.png';

import { DragWrapper } from './DragWrapper';

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
    duplicator: true,
    numUses: 1,
  });

  ornaments.push({
    type: OrnamentType.Greeting,
    id: uuidv4(),
    top: 575,
    left: 15,
    duplicator: true,
    numUses: 1,
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
  onDragOver?: (evt: DragEvent<HTMLDivElement>) => void;
}

const RecycleBin: React.FC<RecycleBinProps> = ({
  onDrop,
  onDragOver,
}) => {
  return (
    <div className='recycle-wrapper'>
      <img
        src={Recycle}
        className='recycle'
        onDrop={onDrop}
        onDragOver={onDragOver}
      />
      <div className='recycle-spacer' />
    </div>
  );
}

interface DragAndDropDisplayProps {
  pageId: string;
}

export const SidebarHomeButton: React.FC = () => {
  return (
    <Link to='/drag-and-drop'>
      <img src={homeButtonImg} className='home-button' />
    </Link>
  )
}

// export const glowButton: React.FC<OrnamentProps> = ({
//   ornament,
//   selectedId,
//   setSelectedId,
//   ...rest
// }) => {
//   const { id, top, left, type, } = ornament;
//   const isSelected = selectedId === id;
//   const glowButtonPushed = 
//   const className = getClassFromOrnamentType(type);
//   const handleClick = (evt: MouseEvent) => {
//     evt.preventDefault();
//     setSelectedId(isSelected ? undefined : id);
//   }
//   let classes = `${className} ornament-hover`;

//   if (isSelected) {
//     classes = `${classes} ornament-selected`;
//   }
// }



// this is both our wrapper and a very simple example
export const DragAndDropDisplay: React.FC<DragAndDropDisplayProps> = ({ pageId }) => {
  const [isValidId, setIsValidId] = useState<boolean | undefined>(undefined);
  const [ornaments, setOrnaments] = useState<SavedOrnament[]>([]);
  const [dragId, setDragId] = useState<string | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [initOrns, setInitOrns] = useState<SavedOrnament[]>(createInitialOrnaments());
  const [isLit, setIsLit] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    async function loadOrnaments() {
      const remoteOrnaments = await getRemoteOrnaments(pageId);
      if (!remoteOrnaments) {
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
    return <Redirect to='/drag-and-drop' />;
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
    const sideWrap = document.getElementById('sidebar-wrapper');
    if (dragEle !== null && sideWrap !== null) {
      const xOff = parseInt(offset[0], 10);
      const yOff = parseInt(offset[1], 10);
      const copy = [...ornaments];
      let targetElement = copy.filter(({ id }) => id === dragId)[0];
      if (!targetElement) {
        const origCopy = [...initOrns];
        targetElement = origCopy.filter(({ id }) => id === dragId)[0];
      }
      if (targetElement.duplicator) {
        const copyOrnament = {
          ...targetElement,
          id: uuidv4(),
          left: event.clientX + xOff - sideWrap.offsetWidth,
          top: event.clientY + yOff,
          duplicator: false,
          numUses: undefined,
        };
        copy.push(copyOrnament);

        const initCopy = [...initOrns];
        if (targetElement.numUses && targetElement.numUses <= 1) {
          const withoutTarget = initCopy.filter(({ id }) => id !== targetElement.id);
          setInitOrns(withoutTarget);
        } else {
          initCopy.forEach((orn) => {
            if (orn.id === targetElement.id && orn.numUses) {
              orn.numUses -= 1;
            }
          });
          setInitOrns(initCopy);
        }
      } else {
        targetElement.left = event.clientX + xOff;
        targetElement.top = event.clientY + yOff;
      }

      setAndSave(copy);
    }
    return false;
  }

  const onRecycleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('dropped');
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

  interface GlowButtonProps {
    handleGlow: (evt: MouseEvent) => void;
  }
 

  const GlowButton: React.FC<GlowButtonProps> = ({handleGlow}) => {
    return (
      <button className='glow-button' onClick={handleGlow}> It's Lit </button>
    )
  }
  
  const handleGlow = (evt: MouseEvent) => {
    evt.preventDefault();
    setIsLit(!isLit);

  }



  ///button first
  // once button is working, go into drag and drop display
  // create a function (NOT FC) "event handler function"
  // handles a mouse event 
  // pass THIS function to glowbutton component
  // on or off 'boolean' const isLit, setIsLit
  // pass isLit to each ornament 
  // add property to ornament called isLit? 
  // if 


  return (
    <div
      className='dnd-container'
    >

      <Sidebar width={350}>
        <div className='dnd-container-sidebar'>
          <div className='home-button-image-wrap'>
            <SidebarHomeButton />
            <div className='home-button-image-tooltip-bg' />
            <div className='home-button-image-tooltip'>
              Home
        </div>
          </div>

          <div className='dnd-container-sidebar-content'>

            {
              initOrns.map((ornament) => (
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
          <GlowButton handleGlow={handleGlow}
            />
          <RecycleBin onDrop={onRecycleDrop} onDragOver={onDragOver} />
        </div>
      </Sidebar>
      <div
        className='dnd-drop-zone'
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDrag={onDrag}
      >
        <img src={Tree} className='tree' />
        {
          ornaments.map((ornament) => (
            <Ornament
              key={ornament.id}
              id={ornament.id}
              ornament={ornament}
              setDragId={setDragId}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              isAbsPos={true}
            />
          ))
        }
      </div>
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
    await saveRemoteOrnaments(newId, []);
    setCreatedId(newId);
  }

  const deleteTree = async (id?: string) => {
    const removed = await deleteTreeById(id);
    if (removed) {
      const filteredIds = existingIds.filter((existingId) =>
        existingId !== id);
      setExistingIds(filteredIds);
    }
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
            <TreeRowDisplay
              id={existingId}
              deleteTree={deleteTree}
            />
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
