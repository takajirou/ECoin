import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Mission } from "types/mission";

interface TaskCard {
    mission: Mission;
    isSelected: boolean;
    onPress: (mission: Mission) => void;
}

const TaskCard: React.FC<TaskCard> = ({ mission, isSelected, onPress }) => {
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

    return (
        <TouchableOpacity
            style={[
                styles.missionCard,
                isSelected && styles.selectedMissionCard,
            ]}
            onPress={() => onPress(mission)}
        >
            <View style={styles.missionHeader}>
                <Text
                    style={[
                        styles.missionTitle,
                        isSelected && styles.selectedMissionTitle,
                    ]}
                >
                    {mission.title}
                </Text>
                <View
                    style={[
                        styles.difficultyBadge,
                        {
                            backgroundColor: getDifficultyColor(
                                mission.difficulty
                            ),
                        },
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
                    isSelected && styles.selectedMissionDescription,
                ]}
            >
                {mission.description}
            </Text>

            <View style={styles.missionFooter}>
                <Text
                    style={[
                        styles.pointText,
                        isSelected && styles.selectedPointText,
                    ]}
                >
                    {mission.point}ポイント
                </Text>
                {mission.require_proof && (
                    <Text style={styles.proofText}>証明必要</Text>
                )}
            </View>

            {/* 選択インジケーター（必要に応じてコメントアウト解除）
            {isSelected && (
                <View style={styles.selectedIndicator}>
                    <Text style={styles.selectedIndicatorText}>
                        ✓ 選択済み
                    </Text>
                </View>
            )} */}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
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
});

export default TaskCard;
