import React from "react";
import { View, Text, Button } from "react-native";
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
        <View>
            <Text>ホーム画面</Text>
            <Button title="新規登録" onPress={() => router.push("/auth/SignUp")} />
            <Button title="ログイン" onPress={() => router.push("/auth/Login")} />
            <Button title="タスク一覧へ" onPress={() => router.push("/tusks")} />
        </View>
    );
};

export default Home;
