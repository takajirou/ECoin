import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Animated,
} from "react-native";

// ダミー型定義
type Mission = {
    id: number;
    title: string;
    description: string;
    difficulty: "easy" | "medium" | "hard";
    point: number;
    active?: boolean;
};

// ダミーデータ
const DUMMY_MISSIONS: Mission[] = [
    {
        id: 1,
        title: "マイボトルを持参する",
        description: "外出時にマイボトルを持って行くことでペットボトル削減",
        difficulty: "easy",
        point: 10,
        active: true,
    },
    {
        id: 2,
        title: "電気をこまめに消す",
        description: "部屋を出るときに電気を消す習慣をつける",
        difficulty: "medium",
        point: 20,
        active: true,
    },
    {
        id: 3,
        title: "自転車で通勤/通学する",
        description: "週に1回は車を使わず自転車で移動",
        difficulty: "hard",
        point: 50,
        active: true,
    },
];

const TopDashboard: React.FC = () => {
    const [isEventOpen, setIsEventOpen] = useState(false);
    const [selectedMission] = useState<Mission | null>(DUMMY_MISSIONS[0]);
    const [streak] = useState(5);
    const [monthlySaving] = useState(1280); // 円
    const [co2Saved] = useState(12.4); // kg
    const [rankingPosition] = useState(42);
    const [regionComparison] = useState({ myPref: 12.4, prefectureAvg: 9.1 });

    const progressAnim = new Animated.Value(co2Saved / 50); // 50kgを目標に

    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* ヘッダー */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>エコダッシュボード</Text>
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={() => setIsEventOpen(true)}
                        >
                            <Text style={styles.headerButtonText}>
                                イベント
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.headerButton, styles.primaryBtn]}
                        >
                            <Text
                                style={[
                                    styles.headerButtonText,
                                    styles.primaryText,
                                ]}
                            >
                                ランキング
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 上位統計カード群 */}
                <View style={styles.statRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>今月の節約額</Text>
                        <Text style={styles.statValue}>
                            ¥{monthlySaving.toLocaleString()}
                        </Text>
                        <Text style={styles.small}>この金額は目安です</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>連続達成日数</Text>
                        <Text style={styles.statValue}>{streak}日</Text>
                        <Text style={styles.small}>連続記録を伸ばそう！</Text>
                    </View>
                </View>

                {/* CO2可視化カード */}
                <View style={styles.co2Card}>
                    <View style={styles.co2Left}>
                        <Text style={styles.co2Label}>累計CO₂削減量</Text>
                        <Text style={styles.co2Value}>{co2Saved} kg</Text>
                        <Text style={styles.small}>目標: 50 kg</Text>

                        <View style={styles.progressBg}>
                            <Animated.View
                                style={[
                                    styles.progressFg,
                                    {
                                        width: `${Math.min((co2Saved / 50) * 100, 100)}%`,
                                    },
                                ]}
                            />
                        </View>
                    </View>

                    <View style={styles.co2Right}>
                        <Text style={styles.co2Mini}>地域平均 vs あなた</Text>
                        <View style={styles.compareRow}>
                            <View style={styles.compareItem}>
                                <Text style={styles.compareLabel}>あなた</Text>
                                <Text style={styles.compareValue}>
                                    {regionComparison.myPref}kg
                                </Text>
                            </View>
                            <View style={styles.compareItem}>
                                <Text style={styles.compareLabel}>県平均</Text>
                                <Text style={styles.compareValue}>
                                    {regionComparison.prefectureAvg}kg
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.small}>
                            県別バトルに参加してみよう
                        </Text>
                    </View>
                </View>

                {/* 今日のおすすめミッション */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        今日のおすすめミッション
                    </Text>
                    {selectedMission ? (
                        <TouchableOpacity style={styles.missionCard}>
                            <View style={styles.missionLeft}>
                                <Text style={styles.missionTitle}>
                                    {selectedMission.title}
                                </Text>
                                <Text style={styles.missionDesc}>
                                    {selectedMission.description}
                                </Text>
                                <Text style={styles.missionMeta}>
                                    難易度:{" "}
                                    {mapDifficultyToJapanese(
                                        selectedMission.difficulty
                                    )}{" "}
                                    ・ {selectedMission.point}pt
                                </Text>
                            </View>
                            <View style={styles.missionRight}>
                                <TouchableOpacity style={styles.actionBtn}>
                                    <Text style={styles.actionBtnText}>
                                        挑戦する
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.small}>
                            今日のおすすめはありません
                        </Text>
                    )}
                </View>

                {/* 最近の実績 / お知らせ */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>最近の実績</Text>
                    <View style={styles.activityItem}>
                        <Text style={styles.activityText}>
                            ・
                            昨日「マイボトルを持参する」を達成しました（+10pt）
                        </Text>
                    </View>
                    <View style={styles.sectionTitleTopSpace} />
                    <Text style={styles.sectionTitle}>豆知識</Text>
                    <Text style={styles.small}>
                        マイボトルを1年使うと、ペットボトル約120本分を削減できます。
                    </Text>
                </View>

                {/* フッターナビの余白 */}
                <View style={{ height: 120 }} />
            </ScrollView>

            {/* 画面右下にイベントバッジ */}
            <View style={styles.fabRow} pointerEvents="box-none">
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => setIsEventOpen(true)}
                >
                    <Text style={styles.fabText}>イベントを見る</Text>
                </TouchableOpacity>
            </View>

            {/* イベントモーダル */}
            <Modal visible={isEventOpen} transparent animationType="slide">
                <View style={styles.modalOverlayCenter}>
                    <View style={styles.eventModal}>
                        <Text style={styles.eventTitle}>期間限定イベント</Text>
                        <Text style={styles.small}>
                            今週は「プラスチック削減チャレンジ」！参加してボーナスポイントをゲットしよう。
                        </Text>

                        <View style={styles.modalButtonsRow}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.cancelModalBtn]}
                                onPress={() => setIsEventOpen(false)}
                            >
                                <Text style={styles.modalBtnText}>閉じる</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.modalBtn,
                                    styles.primaryModalBtn,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.modalBtnText,
                                        styles.primaryText,
                                    ]}
                                >
                                    参加する
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default TopDashboard;

// ヘルパー
function mapDifficultyToJapanese(d: string) {
    switch (d) {
        case "easy":
            return "簡単";
        case "medium":
            return "普通";
        case "hard":
            return "難しい";
        default:
            return "普通";
    }
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#f5f7fb" },
    container: { padding: 16, paddingBottom: 40 },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    headerTitle: { fontSize: 22, fontWeight: "700", color: "#1b5e20" },
    headerRow: { flexDirection: "row" },
    headerButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginLeft: 8,
        borderWidth: 1,
        borderColor: "#d0d7d5",
    },
    headerButtonText: { fontSize: 14 },
    primaryBtn: { backgroundColor: "#1b5e20", borderWidth: 0 },
    primaryText: { color: "#fff" },

    statRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
        marginRight: 8,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        elevation: 2,
    },
    statLabel: { fontSize: 12, color: "#666" },
    statValue: { fontSize: 18, fontWeight: "700", marginTop: 8, color: "#333" },
    small: { fontSize: 12, color: "#666", marginTop: 6 },

    co2Card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    co2Left: { flex: 1 },
    co2Right: { width: 140, paddingLeft: 12, justifyContent: "center" },
    co2Label: { fontSize: 13, color: "#666" },
    co2Value: {
        fontSize: 20,
        fontWeight: "800",
        color: "#2e7d32",
        marginTop: 6,
    },
    co2Mini: { fontSize: 12, color: "#666", marginBottom: 6 },
    progressBg: {
        height: 12,
        backgroundColor: "#edf7ed",
        borderRadius: 8,
        marginTop: 8,
        overflow: "hidden",
    },
    progressFg: { height: 12, backgroundColor: "#2e7d32" },
    compareRow: { flexDirection: "row", justifyContent: "space-between" },
    compareItem: { alignItems: "center" },
    compareLabel: { fontSize: 12, color: "#444" },
    compareValue: { fontSize: 16, fontWeight: "700", color: "#333" },

    section: {
        marginBottom: 14,
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 8,
        color: "#333",
    },
    sectionTitleTopSpace: { height: 8 },

    missionCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    missionLeft: { flex: 1, paddingRight: 12 },
    missionTitle: { fontSize: 15, fontWeight: "700", color: "#1b5e20" },
    missionDesc: { fontSize: 13, color: "#666", marginTop: 6 },
    missionMeta: { fontSize: 12, color: "#999", marginTop: 8 },
    missionRight: { width: 100, alignItems: "flex-end" },
    actionBtn: {
        backgroundColor: "#1b5e20",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    actionBtnText: { color: "#fff", fontWeight: "700" },

    activityItem: { paddingVertical: 8 },
    activityText: { color: "#444" },

    fabRow: { position: "absolute", right: 16, bottom: 18 },
    fab: {
        backgroundColor: "#ff9800",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 24,
        elevation: 6,
    },
    fabText: { color: "#fff", fontWeight: "700" },

    modalOverlayCenter: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    eventModal: {
        width: "85%",
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
    },
    eventTitle: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
    modalButtonsRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 12,
    },
    modalBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginLeft: 8,
    },
    cancelModalBtn: { backgroundColor: "#e0e0e0" },
    primaryModalBtn: { backgroundColor: "#2e7d32" },
    modalBtnText: { color: "#fff", fontWeight: "700" },
});
