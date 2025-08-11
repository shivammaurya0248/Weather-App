import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import AQIIcon from "./svgComponents/aqiIcon";
import { router } from 'expo-router';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 120,
        width: '94%',
        marginBottom: 10,
        borderRadius: 10,
        overflow: 'visible',
        resizeMode: 'contain',
        alignSelf: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    innerContainer: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    ValueText: {
        fontSize: 30,
        alignSelf: 'flex-start',
        color: 'white',
        fontWeight: 'bold',
    },
    AQIText: {
        fontSize: 13,
        color: "white",
    },
    airQualityIcon: {
        width: 40,
        height: 40,
        marginRight: 5,
    },
    button: {
        paddingBottom: 10,
        borderRadius: 10,
        marginTop: 10,
        alignSelf: 'flex-end',
        marginRight: 10,
    },
    startAssign: {
        alignSelf: 'flex-start',
        margin: 10,
    },
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

export default class AQIInfo extends React.Component <{AQIData: any, City: string}>{

    render() {
        const aqiValue = this.props.AQIData ? this.props.AQIData.aqi : null;
        const aqiDescription = getAqiDescription(aqiValue);

        return (
            <View style={styles.container}>
                <Text style={[styles.AQIText, styles.startAssign]}>Air Quality Index</Text>

                <View style={styles.innerContainer}>
                    <AQIIcon style={styles.airQualityIcon} fill="white"/>
                    <Text style={styles.ValueText}>{aqiDescription}</Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => {
                        router.push({
                            pathname: '/airQualityIndex',
                            params: {
                                AQIData: JSON.stringify(this.props.AQIData),
                                City: this.props.City
                            }
                        });
                    }}
                    activeOpacity={1}>
                    <Text style={styles.AQIText}>Full Air Quality Forecast &#10148;</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
