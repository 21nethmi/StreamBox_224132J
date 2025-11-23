import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Theme } from '../store/slices/themeSlice';

// Color definitions for light and dark themes
const lightColors = {
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  backgroundGradientStart: '#667eea',
  backgroundGradientEnd: '#764ba2',
  cardBackground: '#FFFFFF',
  
  // Text colors
  text: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textOnPrimary: '#FFFFFF',
  
  // Border colors
  border: '#E0E0E0',
  borderFocus: '#667eea',
  
  // Input colors
  inputBackground: '#F5F5F5',
  inputBorder: '#E0E0E0',
  inputText: '#000000',
  inputPlaceholder: '#999999',
  
  // Button colors
  buttonPrimary: '#667eea',
  buttonSecondary: '#764ba2',
  buttonText: '#FFFFFF',
  buttonDisabled: '#CCCCCC',
  
  // Status colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  
  // Tab bar colors
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#E0E0E0',
  tabBarActive: '#667eea',
  tabBarInactive: '#999999',
  
  // Modal colors
  modalBackground: '#FFFFFF',
  modalOverlay: 'rgba(0, 0, 0, 0.5)',
  
  // Rating/Star colors
  star: '#FFD700',
  starEmpty: '#E0E0E0',
};

const darkColors = {
  // Background colors
  background: '#121212',
  backgroundSecondary: '#1E1E1E',
  backgroundGradientStart: '#667eea',
  backgroundGradientEnd: '#764ba2',
  cardBackground: '#1E1E1E',
  
  // Text colors
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#808080',
  textOnPrimary: '#FFFFFF',
  
  // Border colors
  border: '#333333',
  borderFocus: '#667eea',
  
  // Input colors
  inputBackground: '#2C2C2C',
  inputBorder: '#404040',
  inputText: '#FFFFFF',
  inputPlaceholder: '#808080',
  
  // Button colors
  buttonPrimary: '#667eea',
  buttonSecondary: '#764ba2',
  buttonText: '#FFFFFF',
  buttonDisabled: '#404040',
  
  // Status colors
  success: '#66BB6A',
  error: '#EF5350',
  warning: '#FFA726',
  info: '#42A5F5',
  
  // Tab bar colors
  tabBarBackground: '#1E1E1E',
  tabBarBorder: '#333333',
  tabBarActive: '#667eea',
  tabBarInactive: '#808080',
  
  // Modal colors
  modalBackground: '#1E1E1E',
  modalOverlay: 'rgba(0, 0, 0, 0.7)',
  
  // Rating/Star colors
  star: '#FFD700',
  starEmpty: '#404040',
};

// Type for theme colors
export type ThemeColors = typeof lightColors;

/**
 * Custom hook to get theme colors based on current theme
 * @returns Object containing all theme colors
 */
export const useThemeColors = (): ThemeColors => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  return theme === 'dark' ? darkColors : lightColors;
};

/**
 * Utility function to get colors for a specific theme (without hook)
 * Useful for components that need colors but can't use hooks
 */
export const getThemeColors = (theme: Theme): ThemeColors => {
  return theme === 'dark' ? darkColors : lightColors;
};

export default useThemeColors;
