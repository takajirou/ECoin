import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import Header from "../components/Header";
import { usePathname } from "expo-router";
import Footer from "../components/Footer";

export default function RootLayout() {
    const pathname = usePathname();
    const pageName = pathname.split("/")[1];

    return (
        <View style={styles.container}>
            {pageName !== "auth" ? (
                <>
                    <LinearGradient
                        colors={["rgba(190, 227, 164,1)", "rgba(190, 227, 164, 0.3)"]}
                        style={styles.gradient}
                    >
                        <View style={styles.content}>
                            <Header />

                            <View style={styles.inner}>
                                <Stack
                                    screenOptions={{
                                        headerShown: false,
                                        contentStyle: { backgroundColor: "transparent" },
                                    }}
                                >
                                    <Stack.Screen name="index" />
                                </Stack>
                            </View>
                        </View>
                    </LinearGradient>
                    <Footer />
                </>
            ) : (
                <>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            contentStyle: { backgroundColor: "transparent" },
                        }}
                    >
                        <Stack.Screen name="index" />
                    </Stack>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 10,
    },
    inner: {
        flex: 1,
        padding: 16,
    },
});
