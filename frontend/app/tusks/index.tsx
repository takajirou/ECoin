import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from "react-native";

import { api } from "@/config";

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
    const [selectedMissions, setSelectedMissions] = useState<number[]>([]);
    const [slideAnim] = useState(new Animated.Value(100));
    const [showButton, setShowButton] = useState(false);

    const UpsertStatus = async (mission_id: number) => {
        try {
            await api.post(`/status/${mission_id}`);
            console.log("ミッションスタッツ更新");
        } catch (error) {
            console.error("ミッションスタッツ更新エラー:", error);
        }
    };
    const UpsertScore = async (score: number) => {
        try {
            await api.post(`/score/${score}`);
            console.log("スコア更新");
        } catch (error) {
            console.error("スコア更新エラー:", error);
        }
    };
    const UpdateCoin = async (coin: number) => {
        try {
            await api.put(`/user/coin/${coin}`);
            console.log("所持コイン更新");
        } catch (error) {
            console.error("コイン更新エラー:", error);
        }
    };

    useEffect(() => {
        const getMissions = async () => {
            try {
                setLoading(true);
                const response = await api.get("/missions");

                setMissions(response.data || []);
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

    const handleMissionPress = (mission: Mission) => {
        setSelectedMissions((prev) => {
            const isSelected = prev.includes(mission.id);
            if (isSelected) {
                return prev.filter((id) => id !== mission.id);
            } else {
                return [...prev, mission.id];
            }
        });
    };

    const isMissionSelected = (missionId: number) => {
        return selectedMissions.includes(missionId);
    };

    // 選択されたミッションを送信する関数
    const handleSubmitMissions = () => {
        console.log("選択されたミッション:", selectedMissions);

        let totalScore = 0;
        selectedMissions.forEach((selectedMission) => {
            UpsertStatus(selectedMission);
            const matchedMission = missions.find((m) => m.id === selectedMission);
            if (matchedMission) {
                totalScore += matchedMission.point;
            }
        });

        UpsertScore(totalScore);
        UpdateCoin(totalScore);
    };

    useEffect(() => {
        if (selectedMissions.length > 0) {
            setShowButton(true);
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 100,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setShowButton(false);
            });
        }
    }, [selectedMissions, slideAnim]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>タスクを読み込み中...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <Text style={styles.title}>エコタスク</Text>
                </View>

                {missions.length === 0 ? (
                    <View style={styles.centerContainer}>
                        <Text style={styles.emptyText}>タスクがありません</Text>
                    </View>
                ) : (
                    missions.map((mission) => (
                        <TouchableOpacity
                            key={mission.id}
                            style={[
                                styles.missionCard,
                                isMissionSelected(mission.id) && styles.selectedMissionCard,
                            ]}
                            onPress={() => handleMissionPress(mission)}
                        >
                            <View style={styles.missionHeader}>
                                <Text
                                    style={[
                                        styles.missionTitle,
                                        isMissionSelected(mission.id) &&
                                            styles.selectedMissionTitle,
                                    ]}
                                >
                                    {mission.title}
                                </Text>
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

                            <Text
                                style={[
                                    styles.missionDescription,
                                    isMissionSelected(mission.id) &&
                                        styles.selectedMissionDescription,
                                ]}
                            >
                                {mission.description}
                            </Text>

                            <View style={styles.missionFooter}>
                                <Text
                                    style={[
                                        styles.pointText,
                                        isMissionSelected(mission.id) && styles.selectedPointText,
                                    ]}
                                >
                                    {mission.point}ポイント
                                </Text>
                                {mission.require_proof && (
                                    <Text style={styles.proofText}>証明必要</Text>
                                )}
                            </View>

                            {isMissionSelected(mission.id) && (
                                <View style={styles.selectedIndicator}>
                                    <Text style={styles.selectedIndicatorText}>✓ 選択済み</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            {/* 送信ボタン（選択されたミッションがある場合のみ表示） */}
            {showButton && (
                <Animated.View
                    style={[
                        styles.submitBtnContainer,
                        {
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitMissions}>
                        <Text style={styles.submitBtnText}>
                            {selectedMissions.length}個のタスクを達成
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    scrollView: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 16,
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
        borderWidth: 2,
        borderColor: "transparent",
    },
    selectedMissionCard: {
        backgroundColor: "#E8F5E8",
        borderColor: "#4CAF50",
        elevation: 4,
        shadowOpacity: 0.2,
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
    selectedMissionTitle: {
        color: "#2E7D32",
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
    selectedMissionDescription: {
        color: "#2E7D32",
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
    selectedPointText: {
        color: "#2E7D32",
    },
    proofText: {
        fontSize: 12,
        color: "#FF9800",
        fontWeight: "bold",
    },
    selectedIndicator: {
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: "#4CAF50",
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    selectedIndicatorText: {
        color: "white",
        fontSize: 10,
        fontWeight: "bold",
    },
    submitBtnContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingVertical: 20,
        paddingBottom: 30,
    },
    submitBtn: {
        backgroundColor: "#4CAF50",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        alignItems: "center",
    },
    submitBtnText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Tusks;
