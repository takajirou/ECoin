import { View, StyleSheet } from "react-native";
import { Stack, usePathname } from "expo-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { NativeBaseProvider } from "native-base";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

export default function RootLayout() {
    const pathname = usePathname();
    const isAuthPage = pathname.startsWith("/auth");

    return (
        <QueryClientProvider client={queryClient}>
            <NativeBaseProvider>
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
                    {/* {!isAuthPage && <Footer />} */}
                </View>
            </NativeBaseProvider>
        </QueryClientProvider>
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
