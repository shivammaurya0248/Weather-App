import { Text, StyleSheet } from "react-native";
import { Component } from "react";

const styles = StyleSheet.create({
    currentText: {
        fontSize: 80,
        color: 'white',
    },
});

export default class CurrentDayTemp extends Component<{currentDayData: any}>{
    render(){
        return(
            <Text style={styles.currentText}>{this.props.currentDayData.temp | 0}°C</Text>
        )
    }
}