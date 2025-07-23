import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import CustomInput from "@components/CustomInput";
import CustomButton from "@components/CustomButton";
import useSignUp from "hooks/useSignUp";

const SignUpScreen = () => {
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [zip, setZip] = useState<string>("");
    const [address, setAddress] = useState<string>("");

    const signUpMutation = useSignUp();

    const CreateAcount = async () => {
        signUpMutation.mutate({ name, email, password });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>新規登録</Text>
                <CustomInput
                    value={name}
                    onChangeText={setName}
                    placeholder="名前"
                />
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
                <CustomInput
                    value={zip}
                    onChangeText={setZip}
                    placeholder="郵便番号"
                />
                <CustomInput
                    value={address}
                    onChangeText={setAddress}
                    placeholder="住所"
                />

                <CustomButton onPress={CreateAcount} value="新規登録" />
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
