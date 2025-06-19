import { View, StyleSheet, SafeAreaView, Text, Button, TouchableOpacity } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
    Home: undefined;
    Detail: undefined;
    SignUp: undefined;
};

const Footer: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <View style={styles.FooterWrap}>
            <TouchableOpacity style={styles.NavBtnWrap} onPress={() => navigation.navigate("Home")}>
                <FontAwesome5 name="calendar-alt" size={28} color="#898888" />
                <Text style={styles.Text}>統計</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.NavBtnWrap} onPress={() => navigation.navigate("Home")}>
                <FontAwesome5 name="tasks" size={28} color="#898888" />
                <Text style={styles.Text}>タスク</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.NavBtnWrap} onPress={() => navigation.navigate("Home")}>
                <FontAwesome5 name="exchange-alt" size={28} color="#898888" />
                <Text style={styles.Text}>交換</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.NavBtnWrap} onPress={() => navigation.navigate("Home")}>
                <Ionicons name="settings-sharp" size={28} color="#898888" />
                <Text style={styles.Text}>設定</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    FooterWrap: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "white",
        height: 80,
        paddingHorizontal: 10,
        paddingBottom: 15,
    },
    NavImages: {
        width: 28,
        height: 28,
        flexDirection: "row",
    },
    NavBtnWrap: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    Text: {
        color: "#898888",
    },
});

export default Footer;
