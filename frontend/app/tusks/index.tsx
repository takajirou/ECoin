import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { api } from "@/config";
import CustomButton from "@components/CustomButton";

interface Mission {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    point: number;
    require_proof: boolean;
    active: boolean;
    created_at: string;
}

const Tusks = () => {
    const [missions, setMissions] = useState<Mission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getMissions = async () => {
            try {
                setLoading(true);
                const response = await api.get("/missions");
                console.log("ミッション取得成功:", response.data);
                setMissions(response.data || []); // nullの場合は空配列
                setError(null);
            } catch (error) {
                console.error("ミッション取得エラー:", error);
                setError("ミッションの取得に失敗しました");
                setMissions([]);
            } finally {
                setLoading(false);
            }
        };
        getMissions();
    }, []);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "easy":
                return "#4CAF50";
            case "medium":
                return "#FF9800";
            case "hard":
                return "#F44336";
            default:
                return "#9E9E9E";
        }
    };

    const getDifficultyText = (difficulty: string) => {
        switch (difficulty) {
            case "easy":
                return "簡単";
            case "medium":
                return "普通";
            case "hard":
                return "難しい";
            default:
                return difficulty;
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>ミッションを読み込み中...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>エコミッション</Text>
            </View>

            {missions.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.emptyText}>ミッションがありません</Text>
                </View>
            ) : (
                missions.map((mission) => (
                    <View key={mission.id} style={styles.missionCard}>
                        <View style={styles.missionHeader}>
                            <Text style={styles.missionTitle}>{mission.title}</Text>
                            <View
                                style={[
                                    styles.difficultyBadge,
                                    { backgroundColor: getDifficultyColor(mission.difficulty) },
                                ]}
                            >
                                <Text style={styles.difficultyText}>
                                    {getDifficultyText(mission.difficulty)}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.missionDescription}>{mission.description}</Text>

                        <View style={styles.missionFooter}>
                            <Text style={styles.pointText}>{mission.point}ポイント</Text>
                            {mission.require_proof && (
                                <Text style={styles.proofText}>証明必要</Text>
                            )}
                        </View>
                    </View>
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingVertical: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    refreshButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
    errorText: {
        fontSize: 16,
        color: "#F44336",
        textAlign: "center",
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: "#F44336",
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
    missionCard: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    missionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
    },
    missionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        flex: 1,
        marginRight: 8,
    },
    difficultyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    difficultyText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    missionDescription: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
        marginBottom: 12,
    },
    missionFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    pointText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#4CAF50",
    },
    proofText: {
        fontSize: 12,
        color: "#FF9800",
        fontWeight: "bold",
    },
});

export default Tusks;
