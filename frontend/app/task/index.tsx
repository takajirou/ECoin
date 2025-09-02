import React, { useEffect, useState } from "react";
import { useMissions } from "hooks/useMissions";
import { upsertStats } from "libs/missions/missionStats/upsertStats";
import { upsertScore } from "libs/score/upsertScore";
import { updateCoin } from "libs/users/updateCoin";
import { useQueryClient } from "@tanstack/react-query";
import { deleteMissions } from "libs/missions/deleteMission";
import { updateMission } from "libs/missions/updateMission";
import useProfile from "hooks/useProfile";
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
    Modal,
    TextInput,
    Switch,
} from "react-native";

const Tasks = () => {
    const [slideAnim] = useState(new Animated.Value(100));
    const [showButton, setShowButton] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingMission, setEditingMission] = useState<Mission | null>(null);
    const [missionTitle, setMissionTitle] = useState("");
    const [missionDescription, setMissionDescription] = useState("");
    const [missionPoint, setMissionPoint] = useState("");
    const [missionDifficulty, setMissionDifficulty] = useState("普通");
    const [isPublic, setIsPublic] = useState(true);

    const queryClient = useQueryClient();
    const { data: profile, isLoading: isProfileLoading } = useProfile();
    const isAdmin = profile?.admin == 1;
    const { data: missions = [], isLoading, error } = useMissions();
    const [selectedMissions, setSelectedMissions] = useState<number[]>([]);

    const difficultyOptions = ["簡単", "普通", "難しい"];

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

    // Admin用の編集機能
    const handleEditMission = (mission?: Mission) => {
        if (mission) {
            setEditingMission(mission);
            setMissionTitle(mission.title || "");
            setMissionDescription(mission.description || "");
            setMissionPoint(mission.point?.toString() || "");
            setMissionDifficulty(mission.difficulty || "普通");
            setIsPublic(mission.active !== false);
        } else {
            // 新規作成の場合
            setEditingMission(null);
            setMissionTitle("");
            setMissionDescription("");
            setMissionPoint("");
            setMissionDifficulty("普通");
            setIsPublic(true);
        }
        setIsEditing(true);
    };

    const handleSaveMission = async () => {
        if (!missionTitle.trim() || !missionPoint.trim()) {
            Alert.alert("エラー", "タイトルとポイントは必須です");
            return;
        }

        try {
            const missionData = {
                title: missionTitle.trim(),
                description: missionDescription.trim(),
                difficulty: missionDifficulty,
                point: parseInt(missionPoint),
                require_proof: false,
                active: isPublic,
            };

            if (editingMission) {
                await updateMission({
                    id: editingMission.id,
                    ...missionData,
                });
                console.log("ミッション更新:", {
                    id: editingMission.id,
                    ...missionData,
                });
            } else {
                // 新規ミッション作成
                // await createMission(missionData);
                console.log("ミッション作成:", missionData);
            }

            // ミッション一覧を再取得
            await queryClient.refetchQueries({
                queryKey: ["missions"],
                exact: false,
            });

            Alert.alert(
                "成功",
                editingMission
                    ? "ミッションを更新しました"
                    : "ミッションを作成しました"
            );
            handleCancelEdit();
        } catch (error) {
            console.error("ミッション保存エラー:", error);
            Alert.alert("エラー", "ミッションの保存に失敗しました");
        }
    };

    const handleDeleteMission = async (mission: Mission) => {
        Alert.alert("確認", `「${mission.title}」を削除しますか？`, [
            {
                text: "キャンセル",
                style: "cancel",
            },
            {
                text: "削除",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteMissions(mission.id);

                        await queryClient.refetchQueries({
                            queryKey: ["missions"],
                            exact: false,
                        });

                        Alert.alert("成功", "ミッションを削除しました");
                    } catch (error) {
                        console.error("ミッション削除エラー:", error);
                        Alert.alert("エラー", "ミッションの削除に失敗しました");
                    }
                },
            },
        ]);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingMission(null);
        setMissionTitle("");
        setMissionDescription("");
        setMissionPoint("");
        setMissionDifficulty("普通");
        setIsPublic(true);
    };

    // 選択されたミッションを送信する関数
    const handleSubmitMissions = async () => {
        if (isSubmitting) return; // 重複実行を防ぐ

        setIsSubmitting(true);

        try {
            let totalScore = 0;

            // 各ミッションを処理
            for (const missionId of selectedMissions) {
                await upsertStats(missionId);
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

    if (isLoading || isProfileLoading) {
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
                    {isAdmin && (
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => handleEditMission()}
                        >
                            <Text style={styles.addButtonText}>+ 追加</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {missions.length === 0 ? (
                    <View style={styles.centerContainer}>
                        <Text style={styles.emptyText}>タスクがありません</Text>
                    </View>
                ) : (
                    missions.map((mission) => (
                        <View key={mission.id} style={styles.missionContainer}>
                            <TaskCard
                                mission={mission}
                                isSelected={isMissionSelected(mission.id)}
                                onPress={handleMissionPress}
                            />
                            {isAdmin && (
                                <View style={styles.adminButtons}>
                                    <TouchableOpacity
                                        style={styles.editButton}
                                        onPress={() =>
                                            handleEditMission(mission)
                                        }
                                    >
                                        <Text style={styles.editButtonText}>
                                            編集
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() =>
                                            handleDeleteMission(mission)
                                        }
                                    >
                                        <Text style={styles.deleteButtonText}>
                                            削除
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
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

            {/* ミッション編集モーダル */}
            <Modal
                visible={isEditing}
                transparent
                animationType="fade"
                onRequestClose={handleCancelEdit}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>
                            {editingMission
                                ? "ミッションを編集"
                                : "新しいミッションを作成"}
                        </Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>タイトル *</Text>
                            <TextInput
                                style={styles.textInput}
                                value={missionTitle}
                                onChangeText={setMissionTitle}
                                placeholder="ミッションのタイトルを入力"
                                maxLength={100}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>説明</Text>
                            <TextInput
                                style={[styles.textInput, styles.textAreaInput]}
                                value={missionDescription}
                                onChangeText={setMissionDescription}
                                placeholder="ミッションの詳細説明を入力"
                                multiline
                                numberOfLines={3}
                                maxLength={500}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>ポイント *</Text>
                            <TextInput
                                style={styles.textInput}
                                value={missionPoint}
                                onChangeText={setMissionPoint}
                                placeholder="獲得ポイントを入力"
                                keyboardType="numeric"
                                maxLength={10}
                            />
                        </View>

                        {/* 難易度選択 - 新規追加 */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>難易度</Text>
                            <View style={styles.difficultyContainer}>
                                {difficultyOptions.map((difficulty) => (
                                    <TouchableOpacity
                                        key={difficulty}
                                        style={[
                                            styles.difficultyOption,
                                            missionDifficulty === difficulty &&
                                                styles.selectedDifficultyOption,
                                        ]}
                                        onPress={() =>
                                            setMissionDifficulty(difficulty)
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.difficultyText,
                                                missionDifficulty ===
                                                    difficulty &&
                                                    styles.selectedDifficultyText,
                                            ]}
                                        >
                                            {difficulty}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* 公開設定トグル - 新規追加 */}
                        <View style={styles.inputContainer}>
                            <View style={styles.switchContainer}>
                                <Text style={styles.inputLabel}>公開設定</Text>
                                <View style={styles.switchRow}>
                                    <Text style={styles.switchLabel}>
                                        {isPublic ? "公開" : "非公開"}
                                    </Text>
                                    <Switch
                                        value={isPublic}
                                        onValueChange={setIsPublic}
                                        trackColor={{
                                            false: "#767577",
                                            true: "#4CAF50",
                                        }}
                                        thumbColor={
                                            isPublic ? "#ffffff" : "#f4f3f4"
                                        }
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={handleCancelEdit}
                            >
                                <Text style={styles.cancelButtonText}>
                                    キャンセル
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSaveMission}
                            >
                                <Text style={styles.saveButtonText}>
                                    {editingMission ? "更新" : "作成"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    addButton: {
        backgroundColor: "#4CAF50",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },
    missionContainer: {
        marginBottom: 10,
    },
    adminButtons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 5,
        paddingHorizontal: 10,
    },
    editButton: {
        backgroundColor: "#2196F3",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginRight: 8,
    },
    editButtonText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    deleteButton: {
        backgroundColor: "#f44336",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    deleteButtonText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
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
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        margin: 20,
        maxWidth: 400,
        width: "90%",
        maxHeight: "80%",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
    },
    textAreaInput: {
        height: 80,
        textAlignVertical: "top",
    },
    // 難易度選択のスタイル - 新規追加
    difficultyContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    difficultyOption: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        marginHorizontal: 4,
        alignItems: "center",
        backgroundColor: "#f9f9f9",
    },
    selectedDifficultyOption: {
        backgroundColor: "#4CAF50",
        borderColor: "#4CAF50",
    },
    difficultyText: {
        fontSize: 14,
        color: "#333",
        fontWeight: "500",
    },
    selectedDifficultyText: {
        color: "white",
        fontWeight: "bold",
    },
    // 公開設定トグルのスタイル - 新規追加
    switchContainer: {
        flexDirection: "column",
    },
    switchRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    switchLabel: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "#9E9E9E",
        paddingVertical: 12,
        borderRadius: 8,
        marginRight: 10,
        alignItems: "center",
    },
    cancelButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    saveButton: {
        flex: 1,
        backgroundColor: "#4CAF50",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    saveButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Tasks;
