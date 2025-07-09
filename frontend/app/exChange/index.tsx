import { View, Text, StyleSheet } from "react-native";
import { api } from "@/config";
import { useEffect, useState } from "react";

const exChange = () => {
    const [rewards, setRewards] = useState([]);

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

    console.log(rewards);

    return (
        <View style={styles.content}>
            <Text>あ</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
});

export default exChange;
