# @no_idea/pinia-plugin-persistent

## Usage

### Install

`pnpm install @no_idea/pinia-plugin-persistent`   


For example:

```ts
import { createPinia } from 'pinia';
import { createPersistedState } from '@no_idea/pinia-plugin-persistent/dist';

const store = createPinia();  

export default {
  install(app: App){
    app.use(store);
    store.use(createPersistedState());
  },
};
```

```ts
const initAuthModule = () => defineStore('auth',() => {
  const token = ref<string>();
  const user = ref<IAuthUser>();

  const setToken = (payload: string) => {
    token.value = payload;
  };

  const setUser = (payload: IAuthUser) => {
    user.value = payload;
  };


  return {
    token,
    setToken,
    user,
    setUser,
  };
},{
  'persist': true,
});
```

#### Configs

```ts
import type { StateTree,PiniaPluginContext } from 'pinia';
import type Storage from '@no_idea/utils/storage';

type RestoreFn = (content: PiniaPluginContext) => void;

// 加密解密方式
export interface Serializer {
  serialize: (value: StateTree) => string
  deserialize: (value: string) => StateTree
}

// 存储方法
export interface OtherStorage{
  getItem<T>(key: string): T
  setItem(key: string,value: any): void
}

export interface PersistedStateOptions {
  key?: string 
  storage?: Storage | OtherStorage
  paths?: string[] // 存储的key
  serializer?: Serializer // 加密解密方式
  beforeRestore?: RestoreFn  // 前置拦截
  afterRestore?: RestoreFn  // 后置拦截
}

type persist?: boolean | PersistedStateOptions

```

## License

MIT