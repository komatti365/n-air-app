import Vue from 'vue';
import * as comps from './index';
import { TObsType } from './ObsInput';

const inputComponents = comps as any as { [key: string]: typeof Vue };

export function propertyComponentForType(type: TObsType): typeof Vue {
  const componentName = Object.keys(inputComponents).find(name => {
    const componentObsType = inputComponents[name]['obsType'];
    return Array.isArray(componentObsType)
      ? componentObsType.includes(type)
      : componentObsType === type;
  });
  if (!componentName) console.warn('Component not found. Type:', type);
  return inputComponents[componentName];
}
