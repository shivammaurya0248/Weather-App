import { Text, StyleSheet, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginBottom: 10,
        width: '80%',
        height: 50,
        backgroundColor: '#9c77c6',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    text: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
})


export default function FiveDayForecastButton(props: any) {
    const {onPress} = props;
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text style={styles.text}>5-day forecast</Text>
        </TouchableOpacity>
    )
}