import React, { useState, useEffect } from "react";
import {
    Text,
    Button,
    StyleSheet,
    SafeAreaView,
    Alert,
    View,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { logoutUser, getToken } from "./config";

type RootStackParamList = {
    Home: undefined;
    Detail: undefined;
    SignUp: undefined;
    Login: undefined;
};

const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // ログイン状態を確認
    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        try {
            const token = await getToken();
            setIsLoggedIn(!!token);
        } catch (error) {
            console.error("ログイン状態の確認に失敗:", error);
            setIsLoggedIn(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert("ログアウト確認", "ログアウトしますか？", [
            {
                text: "キャンセル",
                style: "cancel",
            },
            {
                text: "ログアウト",
                style: "destructive",
                onPress: performLogout,
            },
        ]);
    };

    const performLogout = async () => {
        setIsLoggingOut(true);
        try {
            const result = await logoutUser();

            if (result.success) {
                setIsLoggedIn(false);
                Alert.alert("ログアウト完了", "正常にログアウトしました", [
                    {
                        text: "OK",
                        onPress: () => {
                            router.replace("/auth/Login");
                        },
                    },
                ]);
            } else {
                Alert.alert(
                    "エラー",
                    result.error || "ログアウトに失敗しました"
                );
            }
        } catch (error) {
            console.error("ログアウトエラー:", error);
            Alert.alert("エラー", "ログアウト処理中にエラーが発生しました");
        } finally {
            setIsLoggingOut(false);
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text style={styles.loadingText}>読み込み中...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>ホーム画面</Text>

                {isLoggedIn ? (
                    <View style={styles.loggedInSection}>
                        <Text style={styles.statusText}>ログイン中</Text>

                        <TouchableOpacity
                            style={[
                                styles.logoutButton,
                                isLoggingOut && styles.disabledButton,
                            ]}
                            onPress={handleLogout}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? (
                                <View style={styles.buttonContent}>
                                    <ActivityIndicator
                                        size="small"
                                        color="white"
                                        style={styles.buttonLoader}
                                    />
                                    <Text style={styles.logoutButtonText}>
                                        ログアウト中...
                                    </Text>
                                </View>
                            ) : (
                                <Text style={styles.logoutButtonText}>
                                    ログアウト
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.authButtons}>
                        <TouchableOpacity
                            style={styles.signUpButton}
                            onPress={() => router.push("/auth/SignUp")}
                        >
                            <Text style={styles.signUpButtonText}>
                                新規登録
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={() => router.push("/auth/Login")}
                        >
                            <Text style={styles.loginButtonText}>ログイン</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* リフレッシュボタン（デバッグ用） */}
                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={checkLoginStatus}
                >
                    <Text style={styles.refreshButtonText}>状態を更新</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f5f5f5",
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 30,
    },
    loggedInSection: {
        alignItems: "center",
        width: "100%",
    },
    statusText: {
        fontSize: 18,
        color: "#4CAF50",
        fontWeight: "600",
        marginBottom: 30,
    },
    authButtons: {
        width: "100%",
        alignItems: "center",
    },
    signUpButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        marginBottom: 15,
        width: "80%",
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    signUpButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    loginButton: {
        backgroundColor: "#2196F3",
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        width: "80%",
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    loginButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    logoutButton: {
        backgroundColor: "#f44336",
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        width: "80%",
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    logoutButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    disabledButton: {
        backgroundColor: "#999",
        elevation: 0,
        shadowOpacity: 0,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    buttonLoader: {
        marginRight: 8,
    },
    refreshButton: {
        marginTop: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        backgroundColor: "#E0E0E0",
    },
    refreshButtonText: {
        color: "#666",
        fontSize: 14,
    },
});

export default Home;
