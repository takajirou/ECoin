import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import CustomInput from "@components/CustomInput";
import CustomButton from "@components/CustomButton";
import { useState } from "react";
import useLogin from "hooks/useLogin";
import { useQueryClient } from "@tanstack/react-query";

const LoginScreen = () => {
    const queryClient = useQueryClient();

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const loginMutation = useLogin();
    const handleLogin = async () => {
        try {
            await loginMutation.mutateAsync({ email, password });
            await queryClient.refetchQueries({
                queryKey: ["fetchProfile"],
                exact: false,
            });
        } catch (e) {
            console.error("ログイン失敗:", e);
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
                <CustomInput
                    value={password}
                    placeholder="パスワード"
                    onChangeText={setPassword}
                />

                <CustomButton onPress={handleLogin} value="ログイン" />
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
