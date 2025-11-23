import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_STORAGE_KEY = '@streambox_profile';

export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatar?: string;
}

/**
 * Save profile data to AsyncStorage
 */
export const saveProfile = async (profile: Profile): Promise<void> => {
  try {
    await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile to storage:', error);
    throw error;
  }
};

/**
 * Get profile data from AsyncStorage
 */
export const getProfile = async (): Promise<Profile | null> => {
  try {
    const storedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
    if (storedProfile) {
      return JSON.parse(storedProfile) as Profile;
    }
    return null;
  } catch (error) {
    console.error('Error loading profile from storage:', error);
    return null;
  }
};

/**
 * Clear profile data from AsyncStorage
 */
export const clearProfile = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing profile from storage:', error);
    throw error;
  }
};
