import { Text, StyleSheet } from "react-native";
import { Component } from "react";

const styles = StyleSheet.create({
    weatherText: {
        fontSize: 20,
        color: "white",
    }
})

export default class Weather extends Component<{currentDayData: any}>{
    render(){
        return(
            <Text style={styles.weatherText}>{this.props.currentDayData ? this.props.currentDayData.weather : ''}</Text>
        )
    }
}