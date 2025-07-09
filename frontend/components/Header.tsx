import { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import { Image } from "react-native";
import { api } from "@/config";

const today = new Date();
const weekday = ["日", "月", "火", "水", "木", "金", "土"];
const month = today.getMonth() + 1;
const date = today.getDate();

interface profileResponse {
    id: number;
    uuid: string;
    name: string;
    email: string;
    password: string;
    coins: number;
    pref: string | null;
    city: string | null;
    admin: number;
    created_at: Date;
}

export default function Header() {
    const [profile, setProfile] = useState<profileResponse | null>(null);

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await api.get("/me");
                setProfile(response.data || []);
            } catch (error) {
                console.error("プロフィール取得エラー:", error);
            }
        };
        getProfile();
    }, []);

    return (
        <SafeAreaView>
            <View style={styles.Wrap}>
                <Text style={styles.HeaderTexts}>
                    {month}月{date}日（{weekday[today.getDay()]}）
                </Text>
                <View style={styles.Coins}>
                    <Image style={styles.CoinImg} source={require("../assets/coin.png")} />
                    <Text style={[styles.HeaderTexts, styles.Coin]}>
                        {profile ? profile.coins : 0}
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    Wrap: {
        height: 30,
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    HeaderTexts: {
        fontSize: 24,
        fontWeight: "bold",
    },
    CoinImg: {
        width: 28,
        height: 28,
        marginRight: 5,
    },
    Coins: {
        flexDirection: "row",
    },
    Coin: {
        fontWeight: "bold",
    },
});
