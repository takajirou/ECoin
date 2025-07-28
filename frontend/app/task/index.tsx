import React, { useEffect, useState } from "react";
import { useMissions } from "hooks/useMissions";
import { upsertStatus } from "libs/upsertStatus";
import { upsertScore } from "libs/upsertScore";
import { updateCoin } from "libs/updateCoin";
import { useQueryClient } from "@tanstack/react-query";
import { Mission } from "types/mission";
import TaskCard from "@components/tasks/TaskCard";

import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Alert,
} from "react-native";

const Tasks = () => {
    const [slideAnim] = useState(new Animated.Value(100));
    const [showButton, setShowButton] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const queryClient = useQueryClient();
    const { data: missions = [], isLoading, error } = useMissions();
    const [selectedMissions, setSelectedMissions] = useState<number[]>([]);

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
    const handleSubmitMissions = async () => {
        if (isSubmitting) return; // 重複実行を防ぐ

        setIsSubmitting(true);

        try {
            let totalScore = 0;

            // 各ミッションを処理
            for (const missionId of selectedMissions) {
                await upsertStatus(missionId);
                const mission = missions.find((m) => m.id === missionId);
                if (mission) totalScore += mission.point;
            }

            // スコアとコインを更新
            await upsertScore(totalScore);
            await updateCoin("plus", totalScore);

            // 強制的にrefetch（キャッシュを無視）
            await queryClient.refetchQueries({
                queryKey: ["fetchProfile"],
                exact: false,
                type: "active", // アクティブなクエリのみ
            });

            Alert.alert(
                "ミッション達成！",
                `${selectedMissions.length}つのタスク達成し、${totalScore}ポイント獲得しました！`,
                [
                    {
                        text: "OK",
                    },
                ]
            );
            setSelectedMissions([]);
        } catch (error) {
            console.error("ミッション送信エラー:", error);
        } finally {
            setIsSubmitting(false);
        }
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

    if (isLoading) {
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
                        <TaskCard
                            key={mission.id}
                            mission={mission}
                            isSelected={isMissionSelected(mission.id)}
                            onPress={handleMissionPress}
                        />
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
                    <TouchableOpacity
                        style={styles.submitBtn}
                        onPress={handleSubmitMissions}
                    >
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
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
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

export default Tasks;
