import React from 'react';
import { Link } from 'react-router-dom';

import './DragAndDropComponent.scss';

import Delete from './delete.svg';

export interface TreeRowDisplayProps {
  id: string;
  deleteTree: (id?: string) => void;
}

export const TreeRowDisplay: React.FC<TreeRowDisplayProps> = ({
  id,
  deleteTree,
}) => {
  return (
    <div className='tree-row-display-item'>
      <Link
        to={`/drag-and-drop?id=${id}`}
        className='tree-row-display-link'
        key={id}
      >
        {id.slice(0, 8)}
      </Link>
      <div className='tree-row-display-spacer'/>
      <div className='tree-row-display-image-wrap'>
        <img src={Delete} onClick={(evt) => {
          evt.preventDefault();
          deleteTree(id);
        }}/>
        <div className='tree-row-display-image-tooltip-bg'/>
        <div className='tree-row-display-image-tooltip'>
          Delete me
        </div>
      </div>
    </div>
  );
}
