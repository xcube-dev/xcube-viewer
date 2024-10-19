import { type Storage, getLocalStorage } from "@/util/storage";
import { Config } from "@/config";
import { store, useStore } from "./store";

export interface FeatureOptions<T = unknown> {
  name: string;
  initialState?: T;
  loadState?: (storage: Storage) => Partial<T>;
  saveState?: (storage: Storage) => void;
}

export interface FeatureStore<T = unknown> extends FeatureOptions<T> {
  getState: () => T;
  setState: (state: T | Partial<T>, replace?: boolean) => void;
  useStore: () => T;
  persistState: () => void;
}

export function registerFeature<T>(
  featureOptions: FeatureOptions<T>,
): FeatureStore<T> {
  const name = featureOptions.name;

  const storage = getLocalStorage(Config.instance.name);
  let loadedState: Partial<T> | undefined = undefined;
  if (storage && featureOptions.loadState) {
    try {
      loadedState = featureOptions.loadState(storage);
    } catch (e) {
      console.warn(`failed to load state for slice "${name}"`, e);
    }
  }

  store.setState({
    [name]: { ...featureOptions.initialState, ...loadedState },
  });

  const getState = <T>(): T => store.getState()[name] as T;

  const setState = <T>(state: T | Partial<T>, replace?: boolean): void => {
    if (replace) {
      store.setState({ [name]: state });
    } else {
      const prevState = store.getState()[name] as T;
      store.setState({ [name]: { ...prevState, ...state } });
    }
  };

  // TODO: support selectors!
  const useSlice = <T>(): T => {
    return useStore((state) => state[name] as T);
  };

  const persistState = () => {
    if (storage && featureOptions.saveState) {
      featureOptions.saveState(storage);
    }
  };

  return {
    ...featureOptions,
    getState,
    setState,
    useStore: useSlice,
    persistState,
  };
}
