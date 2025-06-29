import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from "react-native";

type CustomButtonProps = TouchableOpacityProps & {
    onPress: (text: string) => void;
};

const CustomButton: React.FC<CustomButtonProps> = ({ onPress, ...rest }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress} {...rest}>
            <Text style={styles.buttonText}>アカウント作成</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#007AFF",
        height: 50,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default CustomButton;
