import React from "react";
import { SafeAreaView, TextInput, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CustomInput from "@components/CustomInput";
import CustomButton from "@components/CustomButton";
import { useState } from "react";
import axios from "axios";
import { api, setToken } from "@/config";

type RootStackParamList = {
    Home: undefined;
};

type HomeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const LoginScreen = () => {
    const [passWord, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const CreateAcount = async () => {
        try {
            const response = await api.post("/auth/login", { email: email, password: passWord });
            console.log("ログイン成功");
            console.log(response.data);
            const token = response.data.token;
            if (token) {
                // トークンを保存してヘッダーに設定
                await setToken(token);
                console.log("トークンを保存しました");
            } else {
                console.error("トークンが見つかりません");
            }
        } catch (error) {
            console.error("ログインエラー:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>ログイン</Text>

                <CustomInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="メールアドレス"
                    keyboardType="email-address"
                />
                <CustomInput value={passWord} placeholder="パスワード" onChangeText={setPassword} />

                <CustomButton onPress={CreateAcount} value="ログイン" />
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
});

export default LoginScreen;
