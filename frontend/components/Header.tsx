import { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import { Image } from "react-native";
import useProfile from "hooks/useProfile";

const today = new Date();
const weekday = ["日", "月", "火", "水", "木", "金", "土"];
const month = today.getMonth() + 1;
const date = today.getDate();

export default function Header() {
    const { data, isLoading, isError, error } = useProfile();

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

    return (
        <SafeAreaView>
            <View style={styles.Wrap}>
                <Text style={styles.HeaderTexts}>
                    {month}月{date}日（{weekday[today.getDay()]}）
                </Text>
                <View style={styles.Coins}>
                    <Image
                        style={styles.CoinImg}
                        source={require("../assets/coin.png")}
                    />
                    <Text style={[styles.HeaderTexts, styles.Coin]}>
                        {data ? data.coins : 0}
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
