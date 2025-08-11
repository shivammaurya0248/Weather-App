import { Image, StyleSheet, Text, View } from "react-native";
import { getWeatherIcon } from "../utils/getWeather";

const styles = StyleSheet.create({
    icon: {
        height: 30, 
        width: 30,
        overflow: 'visible',
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    day:{
        marginLeft: 10,
        fontSize: 16,
        color: "white",
        alignSelf: 'center',
        flexGrow: 5,
    },
    temperature:{
        fontSize: 20,
        color: "white",
        alignSelf: 'center',
    },
    container: {
        width: '90%',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 100,
        padding: 10,
    }
})

export default function DayWiseInfoRow(props: any) {
    

    return (
        <View style={styles.container}>
            {getWeatherIcon(props.weather, styles)}
            <Text style={styles.day}>{props.day}𑫯{props.weather}</Text>
            <Text style={styles.temperature}>{props.temp}</Text>
        </View>
    )
}


/*

"clear sky"
"few clouds"
"scattered clouds"
"broken clouds"
"shower rain"
"rain"
"thunderstorm"
"snow"
"mist"

*/