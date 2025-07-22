import { View, Text, StyleSheet, Image,SafeAreaView,FlatList } from "react-native";
import useReward from "hooks/useRewards";
import { RewardResponse } from "types/rewards";


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

    if (isLoading) {
        return( 
            <SafeAreaView>
                <Text>読み込み中...</Text>
            </SafeAreaView>
        );
    }
    if (isError) {
        return( 
            <SafeAreaView>
                <Text>エラー: {error?.message}</Text>
            </SafeAreaView>
        );
    }
    if (!data) return null;

    const rewardsArray = Array.isArray(data) ? data : [data];

    return (
        <FlatList<RewardResponse>
            data={rewardsArray}
            keyExtractor={(item) => item.ID.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.content}
            renderItem={({ item }) => (
                <View style={styles.rewardItem}>
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
                </View>
            )}
        />
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
        width: "100%",
        height: 100,
        marginBottom: 8,
        borderRadius: 8,
    },
    placeholderImage: {
        width: "100%",
        height: 100,
        backgroundColor: "#e0e0e0",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
        borderRadius: 8,
    },
    rewardPoints: {
        fontSize: 14,
        fontWeight: "600",
        color: "#007AFF",
        textAlign: "center",
    },
});

export default exChange;
