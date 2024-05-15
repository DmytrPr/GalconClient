import { Application } from 'pixi.js';
import { createContext } from 'react';

const PixiContext = createContext<Application<any> | null>(null);

export default PixiContext;
