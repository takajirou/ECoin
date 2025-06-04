import { View, StyleSheet, SafeAreaView,Text } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

export default function(){
    return(
        <View style={styles.FooterWrap}>
            <View style={styles.NavBtnWrap}>
                <FontAwesome5 name="calendar-alt" size={28} color="#898888" />
                <Text style={styles.Text}>統計</Text>
            </View>
            <View style={styles.NavBtnWrap}>
                <FontAwesome5 name="tasks" size={28} color="#898888" />
                <Text style={styles.Text}>タスク</Text>
            </View>
            <View style={styles.NavBtnWrap}> 
                <FontAwesome5 name="exchange-alt" size={28} color="#898888" />
                <Text style={styles.Text}>交換</Text>
            </View>
            <View style={styles.NavBtnWrap}>
                <Ionicons name="settings-sharp" size={28} color="#898888" />
                <Text style={styles.Text}>設定</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    FooterWrap:{
        flexDirection:"row",
        justifyContent:"space-around",
        alignItems:"center",
        backgroundColor:"white",
        height:80,
        paddingHorizontal:10,
        paddingBottom:15,
    },
    NavImages:{
        width:28,
        height:28,
        flexDirection:"row",
    },
    NavBtnWrap:{
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
    },
    Text:{
        color:"#898888",
    }
})