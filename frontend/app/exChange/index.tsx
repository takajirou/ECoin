import { View, Text, StyleSheet, Image } from "react-native";
import { api } from "@/config";
import { useEffect, useState } from "react";

interface reward {
    name: string;
    description: string;
    required_points: number;
    image_path: string;
    active: number;
    created_at: Date;
}

// 


const exChange = () => {

    const [rewards, setRewards] = useState<reward[]>([]);

    useEffect(() => {
        const getRewards = async () => {
            try {
                const response = await api.get("/rewards");
                setRewards(response.data);
            } catch (error) {
                console.error("交換品取得エラー:", error);
            }
        };
        getRewards();
    }, []);

    return (
        <View style={styles.content}>
            {rewards.map((reward) => (
                <View key={reward.name} style={styles.rewardItem}>
                    <Text style={styles.rewardName}>{reward.name}</Text>
                    <Text style={styles.rewardDescription}>{reward.description}</Text>
                    <Image style={styles.rewardImage}/>
                    <Text style={styles.rewardPoints}>{reward.required_points}ポイント</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 16,
    },
    rewardItem: {
        backgroundColor: "#fff",
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    rewardName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    rewardDescription: {
        fontSize: 14,
        color: "#666",
        marginBottom: 12,
    },
    rewardImage: {
        width: 100,
        height: 100,
        alignSelf: "center",
        marginBottom: 12,
    },
    placeholderImage: {
        width: 100,
        height: 100,
        alignSelf: "center",
        marginBottom: 12,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
    rewardPoints: {
        fontSize: 16,
        fontWeight: "600",
        color: "#007AFF",
        textAlign: "center",
    },
});

export default exChange;