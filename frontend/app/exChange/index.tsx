import {
    View,
    Text,
    StyleSheet,
    Image,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    Modal,
    Alert,
} from "react-native";
import useReward from "hooks/useRewards";
import { RewardResponse } from "types/rewards";
import { useState } from "react";

const images: { [key: string]: any } = {
    bag: require("../../assets/bag.png"),
    cutlery: require("../../assets/cutlery.png"),
    labelFree: require("../../assets/labelFree.png"),
    note: require("../../assets/note.png"),
    siliconeStraw: require("../../assets/siliconeStraw.png"),
    towel: require("../../assets/towel.png"),
    waterBottle: require("../../assets/waterBottle.png"),
    wrap: require("../../assets/wrap.png"),
};

const exChange = () => {
    const { data, isLoading, isError, error } = useReward();
    const [selectedItem, setSelectedItem] = useState<RewardResponse | null>(
        null
    );
    const [isModalVisible, setIsModalVisible] = useState(false);

    if (isLoading) {
        return (
            <SafeAreaView>
                <Text>読み込み中...</Text>
            </SafeAreaView>
        );
    }
    if (isError) {
        return (
            <SafeAreaView>
                <Text>エラー: {error?.message}</Text>
            </SafeAreaView>
        );
    }
    if (!data) return null;

    const handleItemPress = (item: RewardResponse) => {
        setSelectedItem(item);
        setIsModalVisible(true);
    };

    const handleExchange = () => {
        if (!selectedItem) return;

        Alert.alert("交換完了", `${selectedItem.Name}と交換しました！`, [
            {
                text: "OK",
                onPress: () => {
                    setIsModalVisible(false);
                    setSelectedItem(null);
                },
            },
        ]);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedItem(null);
    };

    const rewardsArray = Array.isArray(data) ? data : [data];

    return (
        <View style={{ flex: 1 }}>
            <FlatList<RewardResponse>
                data={rewardsArray}
                keyExtractor={(item) => item.ID.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.content}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.rewardItem]}
                        onPress={() => handleItemPress(item)}
                    >
                        <Text style={styles.rewardName}>{item.Name}</Text>
                        <Text style={styles.rewardDescription}>
                            {item.Description}
                        </Text>
                        {images[item.ImagePath] ? (
                            <Image
                                source={images[item.ImagePath]}
                                style={styles.rewardImage}
                                resizeMode="contain"
                            />
                        ) : (
                            <View style={styles.placeholderImage}>
                                <Text>画像なし</Text>
                            </View>
                        )}
                        <Text style={styles.rewardPoints}>
                            {item.RequiredPoints}ポイント
                        </Text>
                    </TouchableOpacity>
                )}
            />

            {/* 交換確認ダイアログ */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCancel}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        {selectedItem && (
                            <>
                                <Text style={styles.modalTitle}>交換確認</Text>

                                {images[selectedItem.ImagePath] ? (
                                    <Image
                                        source={images[selectedItem.ImagePath]}
                                        style={styles.modalImage}
                                        resizeMode="contain"
                                    />
                                ) : (
                                    <View style={styles.modalPlaceholderImage}>
                                        <Text>画像なし</Text>
                                    </View>
                                )}

                                <Text style={styles.modalItemName}>
                                    {selectedItem.Name}
                                </Text>

                                <Text style={styles.modalDescription}>
                                    {selectedItem.Description}
                                </Text>

                                <Text style={styles.modalPoints}>
                                    必要ポイント: {selectedItem.RequiredPoints}
                                    ポイント
                                </Text>

                                <Text style={styles.confirmText}>
                                    このアイテムと交換しますか？
                                </Text>

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            styles.cancelButton,
                                        ]}
                                        onPress={handleCancel}
                                    >
                                        <Text style={styles.cancelButtonText}>
                                            キャンセル
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            styles.exchangeButton,
                                        ]}
                                        onPress={handleExchange}
                                    >
                                        <Text style={styles.exchangeButtonText}>
                                            交換する
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: 10,
        backgroundColor: "#f5f5f5",
    },
    row: {
        justifyContent: "space-between",
        marginBottom: 10,
    },
    rewardItem: {
        backgroundColor: "#fff",
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 8,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    rewardName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    rewardDescription: {
        fontSize: 13,
        color: "#666",
        marginBottom: 8,
    },
    rewardImage: {
        width: 100,
        height: 100,
        marginBottom: 8,
        borderRadius: 8,
    },
    placeholderImage: {
        width: 100,
        height: 100,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
        borderRadius: 8,
    },
    rewardPoints: {
        fontSize: 14,
        fontWeight: "600",
        color: "#4CAF50",
        textAlign: "center",
    },
    // モーダルのスタイル
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
        maxWidth: 350,
        width: "90%",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#333",
    },
    modalImage: {
        width: 120,
        height: 120,
        marginBottom: 16,
        borderRadius: 8,
    },
    modalPlaceholderImage: {
        width: 120,
        height: 120,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        borderRadius: 8,
    },
    modalItemName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
        color: "#333",
    },
    modalDescription: {
        fontSize: 14,
        color: "#666",
        marginBottom: 12,
        textAlign: "center",
    },
    modalPoints: {
        fontSize: 16,
        fontWeight: "600",
        color: "#4CAF50",
        marginBottom: 16,
        textAlign: "center",
    },
    confirmText: {
        fontSize: 16,
        marginBottom: 24,
        textAlign: "center",
        color: "#333",
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 12,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 100,
    },
    cancelButton: {
        backgroundColor: "#f0f0f0",
        borderWidth: 1,
        borderColor: "#ddd",
    },
    exchangeButton: {
        backgroundColor: "#007AFF",
    },
    cancelButtonText: {
        color: "#333",
        fontWeight: "600",
        textAlign: "center",
    },
    exchangeButtonText: {
        color: "#fff",
        fontWeight: "600",
        textAlign: "center",
    },
});

export default exChange;
