import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import Header from "./Header";
import Footer from "./Footer";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
    children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["rgba(190, 227, 164,1)", "rgba(190, 227, 164, 0.3)"]}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    <Header />
                    <View style={styles.inner}>{children}</View>
                </View>
            </LinearGradient>
            <Footer />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
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

export default Layout;
