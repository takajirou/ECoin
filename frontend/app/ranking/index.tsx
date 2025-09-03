import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Platform,
    TouchableOpacity,
} from "react-native";
import { useRanking } from "hooks/useRanking";
import { RankingResponse } from "types/ranking";

const DUMMY_RANKINGS = [
    { id: 1, name: "田中 太郎", points: 150 },
    { id: 2, name: "佐藤 花子", points: 120 },
    { id: 3, name: "鈴木 次郎", points: 100 },
    { id: 4, name: "高橋 三郎", points: 80 },
    { id: 5, name: "中村 四郎", points: 60 },
];

const RankingScreen = () => {
    const [ranking, setRanking] = useState<RankingResponse[]>([]);
    const [period, setPeriod] = useState<"week" | "month">("week");
    const [weekOffset, setWeekOffset] = useState(0); // 0=今週, -1=先週
    const [monthOffset, setMonthOffset] = useState(0); // 0=今月, -1=先月

    function getWeekNumber(d: Date) {
        const date = new Date(d.getTime());
        date.setHours(0, 0, 0, 0);
        // 木曜日を基準にしてISO週番号を計算
        date.setDate(date.getDate() + 4 - (date.getDay() || 7));
        const yearStart = new Date(date.getFullYear(), 0, 1);
        const weekNo = Math.ceil(
            ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
        );
        return `${date.getFullYear()}-${weekNo.toString().padStart(2, "0")}`;
    }

    const getPeriodValue = () => {
        const now = new Date();

        if (period === "week") {
            // weekOffset を反映した日付を取得
            const targetDate = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + weekOffset * 7
            );

            // ISO 週番号を計算（木曜日を基準）
            const date = new Date(targetDate.getTime());
            date.setHours(0, 0, 0, 0);
            date.setDate(date.getDate() + 4 - (date.getDay() || 7));

            const yearStart = new Date(date.getFullYear(), 0, 1);
            const weekNo = Math.ceil(
                ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
            );

            return `${date.getFullYear()}-${weekNo.toString().padStart(2, "0")}`; // YYYY-WW
        } else {
            // monthOffset を反映した日付を取得
            const targetDate = new Date(
                now.getFullYear(),
                now.getMonth() + monthOffset,
                1
            );

            // ローカル時間で年・月を取得
            const year = targetDate.getFullYear();
            const month = (targetDate.getMonth() + 1)
                .toString()
                .padStart(2, "0");

            return `${year}-${month}`; // YYYY-MM
        }
    };

    const {
        data: rankingData,
        isLoading,
        error,
    } = useRanking(period, getPeriodValue());

    const handlePrev = () => {
        if (period === "week") {
            setWeekOffset((prev) => prev - 1);
        } else {
            setMonthOffset((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        if (period === "week" && weekOffset < 0) {
            setWeekOffset((prev) => prev + 1);
        } else if (period === "month" && monthOffset < 0) {
            setMonthOffset((prev) => prev + 1);
        }
    };

    const togglePeriod = () => {
        setPeriod((prev) => (prev === "week" ? "month" : "week"));
        setWeekOffset(0);
        setMonthOffset(0);
    };

    const renderPeriodText = () => {
        if (period === "week") {
            if (weekOffset === 0) return "今週";
            return `${Math.abs(weekOffset)}週前`;
        } else {
            if (monthOffset === 0) return "今月";
            return `${Math.abs(monthOffset)}ヶ月前`;
        }
    };

    const canGoNext =
        (period === "week" && weekOffset < 0) ||
        (period === "month" && monthOffset < 0);

    console.log(getPeriodValue());

    return (
        <View style={styles.container}>
            {/* 週/月切り替え */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={togglePeriod}
                >
                    <Text style={styles.toggleText}>
                        {period === "week" ? "週ランキング" : "月ランキング"}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.navContainer}>
                <TouchableOpacity style={styles.navButton} onPress={handlePrev}>
                    <Text style={styles.navText}>
                        前の{period === "week" ? "週" : "月"}
                    </Text>
                </TouchableOpacity>
                <Text style={styles.currentPeriodText}>
                    {renderPeriodText()}
                </Text>
                {canGoNext && (
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={handleNext}
                    >
                        <Text style={styles.navText}>
                            次の{period === "week" ? "週" : "月"}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* ランキング一覧 */}
            <ScrollView style={styles.scroll}>
                <Text style={styles.title}>ランキング</Text>
                {rankingData && Array.isArray(rankingData)
                    ? rankingData.map((user, index) => (
                          <View key={user.UUID} style={styles.rankCard}>
                              <Text style={styles.rankNumber}>{index + 1}</Text>
                              <View style={styles.userInfo}>
                                  <Text style={styles.userName}>
                                      {user.UserName}
                                  </Text>
                                  <Text style={styles.userPoints}>
                                      {user.Score} pt
                                  </Text>
                              </View>
                          </View>
                      ))
                    : null}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 16,
    },
    scroll: {
        marginTop: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 12,
    },
    toggleButton: {
        backgroundColor: "#2196F3",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    toggleText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    navContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    navButton: {
        backgroundColor: "#eee",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    navText: {
        fontSize: 14,
        color: "#333",
    },
    currentPeriodText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
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
