import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
} from "react-native";
import { router } from "expo-router";

const DUMMY_MISSIONS = [
    { id: 1, title: "電気をこまめに消す", point: 10, difficulty: "easy" },
    { id: 2, title: "自転車で通勤", point: 20, difficulty: "medium" },
    { id: 3, title: "マイバッグを持参", point: 15, difficulty: "easy" },
];

const TopDashboard = () => {
    const [period, setPeriod] = useState<"week" | "month">("week");

    // ダミーデータ
    const co2Saved = period === "week" ? 12.5 : 50; // kg
    const monthlySaving = period === "week" ? 1500 : 6000; // 円
    const consecutiveDays = 7;

    const [isEventModalVisible, setEventModalVisible] = useState(false);

    const togglePeriod = () => {
        setPeriod(period === "week" ? "month" : "week");
    };

    return (
        <ScrollView style={styles.container}>
            {/* 節約額切替 */}
            <View style={styles.periodSwitchContainer}>
                <TouchableOpacity
                    onPress={togglePeriod}
                    style={styles.periodButton}
                >
                    <Text style={styles.periodButtonText}>
                        {period === "week" ? "今週" : "今月"}の統計に切替
                    </Text>
                </TouchableOpacity>
            </View>

            {/* 節約額表示 */}
            <View style={styles.savingContainer}>
                <Text style={styles.savingTitle}>節約金額</Text>
                <Text style={styles.savingValue}>{monthlySaving} 円</Text>
            </View>

            {/* CO2削減量 */}
            <View style={styles.co2Container}>
                <Text style={styles.co2Title}>CO₂削減量</Text>
                <Text style={styles.co2Value}>{co2Saved} kg</Text>
            </View>

            {/* 今日のおすすめミッション */}
            <View style={styles.missionContainer}>
                <Text style={styles.sectionTitle}>
                    今日のおすすめミッション
                </Text>
                {DUMMY_MISSIONS.slice(0, 1).map((mission) => (
                    <View key={mission.id} style={styles.missionCard}>
                        <Text style={styles.missionTitle}>{mission.title}</Text>
                        <Text style={styles.missionPoint}>
                            {mission.point} pt
                        </Text>
                    </View>
                ))}
            </View>

            {/* ランキングボタン */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/ranking")}
            >
                <Text style={styles.buttonText}>ランキングを見る</Text>
            </TouchableOpacity>

            {/* イベントボタン */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => setEventModalVisible(true)}
            >
                <Text style={styles.buttonText}>イベントを確認</Text>
            </TouchableOpacity>

            {/* イベントモーダル */}
            <Modal
                visible={isEventModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setEventModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>イベント詳細</Text>
                        <Text style={styles.modalContent}>
                            ここにイベント内容を表示します（ダミーデータ）
                        </Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setEventModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>閉じる</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 16,
    },
    periodSwitchContainer: {
        marginBottom: 16,
        alignItems: "center",
    },
    periodButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    periodButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    savingContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        alignItems: "center",
    },
    savingTitle: {
        fontSize: 16,
        color: "#333",
    },
    savingValue: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#4CAF50",
        marginTop: 8,
    },
    co2Container: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        alignItems: "center",
    },
    co2Title: {
        fontSize: 16,
        color: "#333",
    },
    co2Value: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#2196F3",
        marginTop: 8,
    },
    missionContainer: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    missionCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    missionTitle: {
        fontSize: 16,
        color: "#333",
    },
    missionPoint: {
        fontSize: 16,
        color: "#4CAF50",
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "#4CAF50",
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        width: "80%",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    modalContent: {
        fontSize: 16,
        color: "#333",
        marginBottom: 20,
        textAlign: "center",
    },
    closeButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    closeButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default TopDashboard;
