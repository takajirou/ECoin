import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { router } from "expo-router";

type RootStackParamList = {
    Home: undefined;
    Detail: undefined;
    SignUp: undefined;
    Login: undefined;
};

const Home = () => {
    return (
        <View style={styles.container}>
            <Text>ホーム画面</Text>
            <Button title="新規登録" onPress={() => router.push("/auth/SignUp")} />
            <Button title="ログイン" onPress={() => router.push("/auth/Login")} />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f5f5f5",
        flex: 1,
    },
});
export default Home;
