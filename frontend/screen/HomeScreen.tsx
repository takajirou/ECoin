import React from "react";
import { View, Text, Button } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Layout from "../components/Layout";

type RootStackParamList = {
    Home: undefined;
    Detail: undefined;
    SignUp: undefined;
};

type HomeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, "Home" | "SignUp">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    return (
        <Layout>
            <Text>ホーム画面</Text>
            <Button title="新規登録" onPress={() => navigation.navigate("SignUp")} />
            <Button title="詳細へ" onPress={() => navigation.navigate("Detail")} />
        </Layout>
    );
};

export default HomeScreen;
