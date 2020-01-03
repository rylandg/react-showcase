import React, { useState, MouseEvent } from 'react';
import { Link } from 'react-router-dom';

import './Sidebar.scss';


export interface SidebarProps {
  startsOpen?: boolean;
  width: number;
}



export const Sidebar: React.FC<SidebarProps> = ({
  width,
  startsOpen,
  children,
}) => {
  const [open, setOpen] = useState<boolean>(startsOpen || false);
  const sidebarWrapperStyle = {
    width,
    maxWidth: width,
    minWidth: width,
  };

  const handleControlEvent = (evt: MouseEvent) => {
    evt.stopPropagation();
    evt.preventDefault();
    setOpen(!open);
  };

  return (
    <div className='sidebar-wrapper' id='sidebar-wrapper'>
      {
        open && (
          <div
            className='sidebar-content'
            style={sidebarWrapperStyle}
          >
            {children}
          </div>
        )
      }
      <div className='sidebar-control-wrapper'>
        <div
          className='sidebar-control'
          onClick={handleControlEvent}
        >
        </div>
      </div>
    </div>
  );
}
