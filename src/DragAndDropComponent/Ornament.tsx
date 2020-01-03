import React, { MouseEvent, ChangeEvent, FC, useState } from 'react';

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
import Greeting from './text-greeting.png';


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
  Greeting = 'Greeting',
}

export interface SavedOrnament {
  id: string;
  type: OrnamentType;
  top: number;
  left: number;
  duplicator?: boolean;
  numUses?: number;
  isLit?: boolean;
}

export interface OrnamentProps extends DragWrapperProps {
  ornament: SavedOrnament;
  isAbsPos?: boolean;
  selectedId?: string;
  setSelectedId: (id?: string) => void;
  isLit?: boolean;
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
  [OrnamentType.Greeting]: Greeting,
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
  if (ornamentType === Greeting) {
    return 'greeting';
  }
  return 'ornament';
}

export interface OrnamentByTypeProps {
  type: OrnamentType;
  classes: string;
  handleClick: (evt: MouseEvent) => void;
  isSelected?: boolean;
}

const OrnamentByType: FC<OrnamentByTypeProps> = ({
  type,
  classes,
  isSelected,
  handleClick,
}) => {
  if (type === OrnamentType.Greeting) {
    return <TextInput onClick={handleClick} isSelected={isSelected}/>;
  }

  return (
    <img
      className={classes}
      src={OrnamentImages[type]}
      onClick={handleClick}
    />
  );
}

// on change handler for the text input
// gets called every time a letter is typed into the field
// need useState called value and setValue starts as undefined or empty string
// when on change is called, set the value with set value to 'event.target.value'
// when you use the text filed, you pass as a value, the use state value
type OnClickFunc = (evt: MouseEvent) => void;

interface TextInputProps {
  onClick?: OnClickFunc;
  isSelected?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  onClick,
  isSelected,
}) => {
  const [value, setValue] = useState<string | undefined>(undefined);
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setValue(event.target.value);
  }
  const override = (event: MouseEvent) => {
    event.stopPropagation();
  }

  const classes = `greeting-wrapper ornament-hover ${isSelected ? 'ornament-selected' : ''}`;
  return (
    <div className={classes}>
      <img src={Greeting} className='greeting-img' onClick={onClick}/>
      <input type="text" className='greeting-text' onChange={onChange} onClick={override}/>
    </div>
  )
}

export const Ornament: React.FC<OrnamentProps> = ({
  isLit,
  ornament,
  selectedId,
  setSelectedId,
  ...rest
}) => {
  const { id, top, left, type, } = ornament;
  const isSelected = selectedId === id;
  const [isLit, setisLit] = useState<boolean>(false);
  const className = getClassFromOrnamentType(type);
  const handleClick = (evt: MouseEvent) => {
    evt.preventDefault();
    setSelectedId(isSelected ? undefined : id);
  }
  let classes = `${className} ornament-hover`;
  if (isSelected) {
    classes = `${classes} ornament-selected`;
  }
  if (isLit) {
    classes = `${classes} ornament-lit`;
  }
  return (
    <DragWrapper
      id={id}
      offsetY={top}
      offsetX={left}
      {...rest}
    >
      <OrnamentByType
        isSelected={isSelected}
        classes={classes}
        handleClick={handleClick}
        type={type}
      />
    </DragWrapper>
  );
}

