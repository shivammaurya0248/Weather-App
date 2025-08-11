import MainScreen from "./index";
import ForecastScreen from "./forecast";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="forecast" options={{ title: "Forecast", headerShown: false }} />
      <Stack.Screen name="airQualityIndex" options={{ headerShown: false }} />
    </Stack>
  );
}
