import {
    View,
    Text,
    Image,
    Modal,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
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

interface ExchangeModalProps {
    visible: boolean;
    item: RewardResponse | null;
    onCancel: () => void;
    onConfirm: () => void;
}

const ExchangeModal = ({
    visible,
    item,
    onCancel,
    onConfirm,
}: ExchangeModalProps) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {item && (
                        <>
                            <Text style={styles.modalTitle}>交換確認</Text>

                            {images[item.ImagePath] ? (
                                <Image
                                    source={images[item.ImagePath]}
                                    style={styles.modalImage}
                                    resizeMode="contain"
                                />
                            ) : (
                                <View style={styles.modalPlaceholderImage}>
                                    <Text>画像なし</Text>
                                </View>
                            )}

                            <Text style={styles.modalItemName}>
                                {item.Name}
                            </Text>
                            <Text style={styles.modalDescription}>
                                {item.Description}
                            </Text>
                            <Text style={styles.modalPoints}>
                                必要ポイント: {item.RequiredPoints}ポイント
                            </Text>
                            <Text style={styles.confirmText}>
                                このアイテムと交換しますか？
                            </Text>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={onCancel}
                                >
                                    <Text style={styles.cancelButtonText}>
                                        キャンセル
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        styles.exchangeButton,
                                    ]}
                                    onPress={onConfirm}
                                >
                                    <Text style={styles.exchangeButtonText}>
                                        交換する
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default ExchangeModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        margin: 20,
        maxWidth: 350,
        width: "90%",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#333",
    },
    modalImage: {
        width: 120,
        height: 120,
        marginBottom: 16,
        borderRadius: 8,
    },
    modalPlaceholderImage: {
        width: 120,
        height: 120,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        borderRadius: 8,
    },
    modalItemName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
        color: "#333",
    },
    modalDescription: {
        fontSize: 14,
        color: "#666",
        marginBottom: 12,
        textAlign: "center",
    },
    modalPoints: {
        fontSize: 16,
        fontWeight: "600",
        color: "#4CAF50",
        marginBottom: 16,
        textAlign: "center",
    },
    confirmText: {
        fontSize: 16,
        marginBottom: 24,
        textAlign: "center",
        color: "#333",
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 12,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 100,
    },
    cancelButton: {
        backgroundColor: "#f0f0f0",
        borderWidth: 1,
        borderColor: "#ddd",
    },
    exchangeButton: {
        backgroundColor: "#007AFF",
    },
    cancelButtonText: {
        color: "#333",
        fontWeight: "600",
        textAlign: "center",
    },
    exchangeButtonText: {
        color: "#fff",
        fontWeight: "600",
        textAlign: "center",
    },
});
