import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { api } from "@/config";
import CustomButton from "@components/CustomButton";

const Tusks = () => {
    const [missions, setMissions] = useState<string[]>([]);

    useEffect(() => {
        const getMissions = async () => {
            try {
                const response = await api.get("/missions"); // これで正しい！
                console.log("ミッション取得成功:", response.data);
                setMissions(response.data);
                return response.data;
            } catch (error) {
                console.error("アカウント作成エラー:", error);
            }
        };
        getMissions();
    }, []);

    return (
        <View>
            {missions.map((mission) => {
                return (
                    <>
                        <p>{mission}</p>
                    </>
                );
            })}
        </View>
    );
};

export default Tusks;
