import type { StateTree,PiniaPluginContext } from 'pinia';

type RestoreFn = (content: PiniaPluginContext) => void;

export interface Serializer {
  serialize: (value: StateTree) => string
  deserialize: (value: string) => StateTree
}

export interface OtherStorage{
  getItem<T>(key: string): T
  setItem(key: string,value: any): void
}

export interface PersistedStateOptions {
  key?: string
  storage?: Storage | OtherStorage
  paths?: string[]
  serializer?: Serializer
  beforeRestore?: RestoreFn
  afterRestore?: RestoreFn
}