import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { Component } from "react";
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { getWeatherIcon } from '@/utils/getWeather';
import moment from 'moment';

const styles = StyleSheet.create({
    OuterContainer: {
        flex: 1,
        flexDirection: 'row',
    //     flex: 1,
    //     backgroundColor: 'rgba(255, 2, 2, 0.2)'
    },
    todaysInnerContainer: {
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    InnerContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: 60,
        marginTop: 10,
        marginHorizontal:5,
        marginBottom: 20,
        borderRadius: 5,
        padding: 1,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        height: 450
    },
    dayNameText: {
        fontSize: 10,
        color: "white",
    }
})

export default function dayInfo() {
    function CurrentDay(date_: string){
        let passed_date = moment(date_, 'DD-MM-YYYY');
        let day_name = '';
        if (moment().format('DD-MM-YYYY') === passed_date.format("DD-MM-YYYY")) { 
            day_name = 'Today'
        }
        else if (moment().add(-1, 'days').format('DD-MM-YYYY') === passed_date.format("DD-MM-YYYY")) {
            day_name = "Yesterday"
        }
        else if (moment().add(1, 'days').format('DD-MM-YYYY') === passed_date.format("DD-MM-YYYY")) {
            day_name = "Tommorow"
        }
        else {
            day_name = passed_date.format("DD-MM")
        }

        return (
            <Text style={[styles.dayNameText]}>{ day_name }</Text>
        )
    }

    


    return (
        <View style={styles.OuterContainer}>
            <View style={[styles.InnerContainer, styles.todaysInnerContainer]}>
                {CurrentDay('09-07-2025')}
            </View>
            <View style={styles.InnerContainer}>
                {CurrentDay('10-07-2025')}
            </View>
            <View style={styles.InnerContainer}>
                {CurrentDay('11-07-2025')}
            </View>
            <View style={styles.InnerContainer}>
                {CurrentDay('12-07-2025')}
            </View>
            <View style={styles.InnerContainer}>
                {CurrentDay('13-07-2025')}
            </View>
        </View>
    )
}