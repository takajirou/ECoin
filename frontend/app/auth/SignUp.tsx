import React from "react";
import { SafeAreaView, TextInput, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import axios from "axios";
import CustomInput from "@components/CustomInput";
import CustomButton from "@components/CustomButton";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

type RootStackParamList = {
    Home: undefined;
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
                <CustomInput value={name} onChangeText={setName} placeholder="名前" />
                <CustomInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="メールアドレス"
                    keyboardType="email-address"
                />
                <CustomInput value={passWord} placeholder="パスワード" onChangeText={setPassword} />

                <CustomButton onPress={CreateAcount} />
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
});

export default SignUpScreen;
