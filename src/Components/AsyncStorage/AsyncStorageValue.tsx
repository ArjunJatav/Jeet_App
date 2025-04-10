import AsyncStorage from '@react-native-async-storage/async-storage';

type StorageKey =
  | 'USER_TOKEN'
  | 'USER_LOGIN_SESSION'
  | 'USER_AUTH_TOKEN'
  | 'APP_THEME'
  | 'FCM_TOKEN'
  | 'IS_LOGGED_IN'; 

interface AsyncStorageUtils {
  setItem<T>(key: StorageKey, value: T): Promise<boolean>;
  getItem<T>(key: StorageKey): Promise<T | null>;
  removeItem(key: StorageKey): Promise<boolean>;
  clearStorage(): Promise<boolean>;
  getAllKeys(): Promise<StorageKey[]>;
  validateKey(key: string): boolean;
}

const AsyncStorageWrapper: AsyncStorageUtils = {

  async setItem<T>(key: StorageKey, value: T): Promise<boolean> {
    try {
      if (!this.validateKey(key)) {
        console.error(`Invalid key: ${key}`);
        return false;
      }
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error(`Error setting item with key "${key}":`, error);
      return false;
    }
  },

 
  async getItem<T>(key: StorageKey): Promise<T | null> {
    try {
      if (!this.validateKey(key)) {
        console.error(`Invalid key: ${key}`);
        return null;
      }
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue ? (JSON.parse(jsonValue) as T) : null;
    } catch (error) {
      console.error(`Error retrieving item with key "${key}":`, error);
      return null;
    }
  },

 
  async removeItem(key: StorageKey): Promise<boolean> {
    try {
      if (!this.validateKey(key)) {
        console.error(`Invalid key: ${key}`);
        return false;
      }
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item with key "${key}":`, error);
      return false;
    }
  },


  async clearStorage(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error(`Error clearing AsyncStorage:`, error);
      return false;
    }
  },

  async getAllKeys(): Promise<StorageKey[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.filter(key => this.validateKey(key)) as StorageKey[];
    } catch (error) {
      console.error(`Error retrieving keys:`, error);
      return [];
    }
  },


  validateKey(key: string): boolean {
    const validKeys: StorageKey[] = [
      'USER_TOKEN',
      'USER_LOGIN_SESSION',
      'USER_AUTH_TOKEN',
      'APP_THEME',
      'FCM_TOKEN',
      'IS_LOGGED_IN',
    ]; // Keep this in sync with StorageKey
    return validKeys.includes(key as StorageKey);
  },
};

export default AsyncStorageWrapper;
