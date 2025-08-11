import React from "react";
import { Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    cityName: {
        fontSize: 20,
        color: "white",
        textAlign: "center",
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
    }
})

export default function CityName(props: { cityName: string }) {
    return (
        <Text style={styles.cityName}>{props.cityName} </Text>
    )
}
