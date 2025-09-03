import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";

const DUMMY_RANKINGS = [
    { id: 1, name: "田中 太郎", points: 150 },
    { id: 2, name: "佐藤 花子", points: 120 },
    { id: 3, name: "鈴木 次郎", points: 100 },
    { id: 4, name: "高橋 三郎", points: 80 },
    { id: 5, name: "中村 四郎", points: 60 },
];

const RankingScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>ランキング</Text>
            {DUMMY_RANKINGS.map((user, index) => (
                <View key={user.id} style={styles.rankCard}>
                    <Text style={styles.rankNumber}>{index + 1}</Text>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userPoints}>{user.points} pt</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 16,
        textAlign: "center",
    },
    rankCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    rankNumber: {
        fontSize: 18,
        fontWeight: "bold",
        width: 30,
        textAlign: "center",
    },
    userInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
        paddingLeft: 12,
    },
    userName: {
        fontSize: 16,
        color: "#333",
    },
    userPoints: {
        fontSize: 16,
        color: "#4CAF50",
        fontWeight: "bold",
    },
});

export default RankingScreen;
