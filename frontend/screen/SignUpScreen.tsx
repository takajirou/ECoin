import React from "react";
import { View, Text, Button, TextInput, SafeAreaView, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Layout from "../components/Layout";
import { useState } from "react";
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

type RootStackParamList = {
    Home: undefined;
};

type HomeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const SignUpScreen = () => {
    const [name, setName] = useState("");
    const [passWord, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const CreateAcount = () => {
        api.post("/users", { name: name, email: email, password: passWord });
    };

    return (
        <SafeAreaView style={styles.SignUpWrap}>
            <Text>新規登録</Text>
            <TextInput
                value={name}
                placeholder="名前"
                onChangeText={setName}
                style={styles.InputField}
            />
            <TextInput
                value={email}
                placeholder="メールアドレス"
                keyboardType="email-address"
                onChangeText={setEmail}
                style={styles.InputField}
            />
            <TextInput
                value={passWord}
                placeholder="パスワード"
                onChangeText={setPassword}
                style={styles.InputField}
            />
            <Button title="アカウント作成" onPress={CreateAcount} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    InputField: {
        width: "100%",
        margin: "auto",
        padding: 10,
        borderWidth: 1,
        borderColor: "#000",
    },
    SignUpWrap: {
        padding: 10,
    },
});

export default SignUpScreen;
