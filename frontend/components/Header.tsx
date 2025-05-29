import { View, StyleSheet, SafeAreaView,Text } from 'react-native';
import { Image } from 'react-native';

const today = new Date();
const weekday = ["日","月","火","水","木","金","土"];
const month = today.getMonth() + 1;
const date = today.getDate();


export default function Header(){
    return(
        <SafeAreaView> 
            <View style={styles.Wrap}>
                <Text style={styles.HaderTexts}>{month}月{date}日（{weekday[today.getDay()]}）</Text>
                <View style={styles.Coins}>
                    <Image style={styles.CoinImg} source={require('../assets/coin.png')}/>
                    <Text style={[styles.HaderTexts, styles.Coin]}>100</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    Wrap:{
        height:30,
        paddingHorizontal:10,
        flexDirection:"row",
        justifyContent:"space-between"
    },
    HaderTexts:{
        fontSize:24,
        fontWeight:"bold",
    },
    CoinImg:{
        width:28,
        height:28,
        marginRight:5,
    },
    Coins:{
        flexDirection:"row"
    },
    Coin:{
        fontWeight:"bold",
    }
})
