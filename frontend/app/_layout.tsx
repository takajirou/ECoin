import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import Header from "../components/Header";
import { usePathname } from "expo-router";
import Footer from "../components/Footer";

export default function RootLayout() {
    return (
        <View style={styles.container}>
            <>
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
                <Footer />
            </>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    gradient: {
        flex: 1,
    },
    content: {
        flex: 1,
        // paddingVertical: 10,
    },
    inner: {
        flex: 1,
    },
});
