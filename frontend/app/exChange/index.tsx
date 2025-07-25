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
import ExchangeModal from "@components/exchange/ExchangeModal";
import postUserReward from "libs/postUserReward";
import { updateCoin } from "libs/updateCoin";
import { useQueryClient } from "@tanstack/react-query";

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

const exchange = () => {
    const { data, isLoading, isError, error } = useReward();
    const [selectedItem, setSelectedItem] = useState<RewardResponse | null>(
        null
    );
    const queryClient = useQueryClient();
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

    const handleExchange = async () => {
        if (!selectedItem) return;
        await postUserReward({ reward_id: selectedItem.ID });
        await updateCoin("minus", selectedItem.RequiredPoints);

        await queryClient.refetchQueries({
            queryKey: ["fetchProfile"],
            exact: false,
        });
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
            <ExchangeModal
                visible={isModalVisible}
                item={selectedItem}
                onCancel={handleCancel}
                onConfirm={handleExchange}
            />
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
});

export default exchange;
