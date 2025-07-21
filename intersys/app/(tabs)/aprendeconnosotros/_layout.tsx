import { Stack } from 'expo-router';

export const screenOptions = {
  headerShown: false,
};

export default function Layout() {
  return <Stack screenOptions={screenOptions} />;
}
  