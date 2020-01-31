import React, { MouseEvent } from 'react';

import { DragWrapper, DragWrapperProps } from './DragWrapper';

import BlueOrnament from './blue-ornament.png';
import GoldOrnament from './gold-ornament.png';
import GreenishOrnament from './greenish-ornament.png';
import GreenBowOrnament from './green-ornament.png';
import Star from './star.png';
import RedOrnament from './red-ornament.png';
import LightsString from './lights-string.jpg';
import ColoredLights from './colored-lights.png';
import WhiteLights from './white-lights.png';
import WhiteLightsSmall from './white-lights-small.png';
import Greeting from 'text-greeting.png';


export enum OrnamentType {
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
}

export interface SavedOrnament {
  id: string;
  type: OrnamentType;
  top: number;
  left: number;
  duplicator?: boolean;
}

export interface OrnamentProps extends DragWrapperProps {
  ornament: SavedOrnament;
  selectedId?: string;
  setSelectedId: (id?: string) => void;
}

export const OrnamentImages = {
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

export const getClassFromOrnamentType = (ornamentType: OrnamentType): string => {
  const lightTypes = [OrnamentType.ColoredLights, OrnamentType.WhiteLights]
  const starType = OrnamentType.Star;
  const smallLightsType = OrnamentType.WhiteLightsSmall; if (lightTypes.includes(ornamentType)) {
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

export const Ornament: React.FC<OrnamentProps> = ({
  ornament,
  selectedId,
  setSelectedId,
  ...rest
}) => {
  const { id, top, left, type, } = ornament;
  const isSelected = selectedId === id;
  const className = getClassFromOrnamentType(type);
  const handleImageClick = (evt: MouseEvent) => {
    evt.preventDefault();
    setSelectedId(isSelected ? undefined : id);
  }
  let classes = `${className} ornament-hover`;
  if (isSelected) {
    classes = `${classes} ornament-selected`;
  }
  return (
    <DragWrapper
      id={id}
      offsetY={top}
      offsetX={left}
      {...rest}
    >
      <img
        className={classes}
        src={OrnamentImages[type]}
        onClick={handleImageClick}
      />
    </DragWrapper>
  );
}

