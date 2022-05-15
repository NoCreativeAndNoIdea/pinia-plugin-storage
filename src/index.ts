import type {
  PiniaPluginContext,
  SubscriptionCallbackMutation,
  StateTree,
} from 'pinia';
import pick from './pick';
import type { PersistedStateOptions } from './types';
import type { StorageType } from '@no_idea/utils';
import { useStorage } from '@no_idea/utils';

export const isStorageType = (val: unknown): val is StorageType => typeof val === 'string';

const useOtherStorage = (factoryOptions: PersistedStateOptions) => {
  const { storage } = factoryOptions;
  if(storage){
    if(isStorageType(storage)){
      return useStorage({
        'type': storage,
      });
    }
    return storage;
  }
  return useStorage({
    'type': 'session',
  });
};


export function createPersistedState (factoryOptions: PersistedStateOptions = {}) {
  return function (context: PiniaPluginContext): void {
    const { 'options': { persist },store } = context;
    if(!persist) { return; }
    const isBoolByPersist = typeof persist === 'boolean';

    const {
      storage = useOtherStorage(isBoolByPersist ? factoryOptions : persist),
      beforeRestore = factoryOptions.beforeRestore ?? null,
      afterRestore = factoryOptions.afterRestore ?? null,
      serializer = factoryOptions.serializer ?? {
        'serialize': (val: StateTree) => val,
        'deserialize': (val: string) => val,
      },
      key = store.$id,
      paths = null,
    } = isBoolByPersist ? {} : persist;
    beforeRestore?.(context);

    try{
      const fromStorage = storage.getItem(key as string);
      if(fromStorage) { store.$patch(serializer.deserialize(fromStorage as string)); }
    }
    catch(_error){
      if(process.env.NODE_MODE === 'development'){
        console.error(_error);
      }
    }

    afterRestore?.(context);

    store.$subscribe((
      _mutation: SubscriptionCallbackMutation<StateTree>,
      state: StateTree
    ) => {
      try{
        const toStore = Array.isArray(paths) ? pick(state,paths) : state;
        storage.setItem(key,serializer.serialize(toStore));
      }
      catch(_error){
        if(process.env.NODE_MODE === 'development'){
          console.error(_error);
        }
      }
    });


  };
}

export * from './types';

declare module 'pinia'{
  export interface DefineStoreOptionsBase<S extends StateTree,Store>{
    /**
     * Persist store in storage
     */
    persist?: boolean | PersistedStateOptions
  }
}

export default createPersistedState();