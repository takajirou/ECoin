import React from "react";
import { Text, Button, StyleSheet, SafeAreaView } from "react-native";
import { router } from "expo-router";

type RootStackParamList = {
    Home: undefined;
    Detail: undefined;
    SignUp: undefined;
    Login: undefined;
};

const Home = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text>ホーム画面</Text>
            <Button
                title="新規登録"
                onPress={() => router.push("/auth/SignUp")}
            />
            <Button
                title="ログイン"
                onPress={() => router.push("/auth/Login")}
            />
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f5f5f5",
        flex: 1,
    },
});
export default Home;
