import { TextInput, StyleSheet, TextInputProps } from "react-native";

type CustomInputProps = TextInputProps & {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
};

const CustomInput: React.FC<CustomInputProps> = ({ value, onChangeText, placeholder, ...rest }) => {
    return (
        <TextInput
            style={styles.input}
            value={value}
            placeholder={placeholder}
            onChangeText={onChangeText}
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="#999"
            {...rest}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: "#fff",
        fontSize: 16,
        color: "#333",
    },
});

export default CustomInput;
