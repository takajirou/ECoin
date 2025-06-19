import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeBaseProvider } from "native-base";

import HomeScreen from "./screen/HomeScreen";
import DetailsScreen from "./screen/DetailsScreen";
import SignUpScreen from "./screen/SignUpScreen";

const Stack = createNativeStackNavigator();

function App() {
    return (
        <NativeBaseProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Detail" component={DetailsScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </NativeBaseProvider>
    );
}

export default App;
