import React from "react";
import { SafeAreaView, TextInput, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

    const CreateAcount = async () => {
        try {
            await api.post("/users", { name: name, email: email, password: passWord });
            console.log("アカウント作成成功");
        } catch (error) {
            console.error("アカウント作成エラー:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>新規登録</Text>

                <TextInput
                    style={styles.input}
                    value={name}
                    placeholder="名前"
                    onChangeText={setName}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="#999"
                />

                <TextInput
                    style={styles.input}
                    value={email}
                    placeholder="メールアドレス"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="#999"
                />

                <TextInput
                    style={styles.input}
                    value={passWord}
                    placeholder="パスワード"
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="#999"
                />

                <TouchableOpacity style={styles.button} onPress={CreateAcount}>
                    <Text style={styles.buttonText}>アカウント作成</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    formContainer: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
        maxWidth: 400,
        alignSelf: "center",
        width: "100%",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 40,
        color: "#333",
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: "#fff",
        fontSize: 16,
        color: "#333",
    },
    button: {
        backgroundColor: "#007AFF",
        height: 50,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default SignUpScreen;
