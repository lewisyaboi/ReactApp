// src/styles/theme.ts
import { StyleSheet } from 'react-native';

// Static COLORS object (no theme logic here)
export let COLORS = {
  primary: '#007AFF',
  accent: '#60A5FA',
  success: '#007AFF',
  textPrimary: '#000000',
  textSecondary: '#6B7280',
  textLight: 'rgba(255,255,255,0.85)',
  textMuted: 'rgba(255,255,255,0.65)',
  glassBorder: 'rgba(255, 255, 255, 0.35)',
  glassDark: 'rgba(40, 40, 80, 0.48)',
  white: '#FFFFFF',

  // Default to light theme (theme === 0) for static values
  back: '#EEE', // light theme default
  conback: '#FFF', // light theme default
  text: '#000', // light theme default
};

export const globalStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 270,
    backgroundColor: COLORS.back,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    marginTop:-20,
  },
  logo: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  titleColumn: {
    flex: 1, 
  },
  appTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  safeArea: {
    flex: 1,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.conback,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    elevation: 8,
  },
  cardContent: {
    flex: 1,
  },
  dayText: {
    fontSize: 21,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  focusText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 3,
    marginBottom: 10,
  },
  exercisesText: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 8,
    lineHeight: 20,
  },
  arrow: {
    fontSize: 30,
    color: '#60a5fa',
    marginLeft: 16,
  },
  footer: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 48,
    fontWeight: '500',
  },
  detailTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  detailFocus: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 32,
  },
  checkboxContainer: {
    marginRight: 16,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  checkboxDone: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.text,
  },
  status: {
    fontSize: 14,
    color: COLORS.success,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 40,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  backText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
});