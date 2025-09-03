import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Stack, usePathname, useRouter, Slot } from "expo-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { NativeBaseProvider } from "native-base";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { initializeAuth } from "@/config";

const queryClient = new QueryClient();

export default function RootLayout() {
    const [mounted, setMounted] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <QueryClientProvider client={queryClient}>
                <NativeBaseProvider>
                    <Slot />
                </NativeBaseProvider>
            </QueryClientProvider>
        );
    }

    return (
        <QueryClientProvider client={queryClient}>
            <NativeBaseProvider>
                <AuthenticatedLayout />
            </NativeBaseProvider>
        </QueryClientProvider>
    );
}

function AuthenticatedLayout() {
    const pathname = usePathname();
    const router = useRouter();
    const isAuthPage = pathname.startsWith("/auth");
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const isValid = await initializeAuth();

                if (!isValid && !isAuthPage) {
                    router.replace("/auth/Login");
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                if (!isAuthPage) {
                    router.replace("/auth/Login");
                }
            } finally {
                setAuthChecked(true);
            }
        };

        checkAuth();
    }, [pathname, isAuthPage, router]);

    if (!authChecked && !isAuthPage) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#666" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {!isAuthPage && <Header />}

                <View style={styles.inner}>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            contentStyle: {
                                backgroundColor: "transparent",
                            },
                        }}
                    >
                        <Stack.Screen name="index" />
                    </Stack>
                </View>
            </View>
            <Footer />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    content: {
        flex: 1,
    },
    inner: {
        flex: 1,
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
});
