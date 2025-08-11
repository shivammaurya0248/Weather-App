import { Text, StyleSheet, View, Image } from "react-native";
import { Component } from "react";
import AQIIcon from "./svgComponents/aqiIcon";


const styles = StyleSheet.create({
    AQIText: {
        fontSize: 15,
        color: "white",
    },
    container: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#4d5e89ba",
        borderRadius: 100,
        margin: 10,
    },
    airQualityIcon: {
        width: 20,
        height: 20,
        marginRight: 5,
    }
})

const getAqiDescription = (aqi: number) => {
    switch (aqi) {
        case 1: return 'Good';
        case 2: return 'Fair';
        case 3: return 'Moderate';
        case 4: return 'Poor';
        case 5: return 'Very Poor';
        default: return 'Unknown';
    }
};

export default class AQI extends Component<{AQIData: any}>{
    render(){
        const aqiValue = this.props.AQIData ? this.props.AQIData.aqi : null;
        const aqiDescription = getAqiDescription(aqiValue);
        return(
            <View style={styles.container}>
                <AQIIcon style={styles.airQualityIcon} fill="white"/>
                <Text style={styles.AQIText}>AQI {aqiDescription}</Text>
            </View>
        )
    }
}
