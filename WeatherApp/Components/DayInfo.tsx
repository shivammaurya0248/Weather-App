import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { Component } from "react";
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { getWeatherIcon } from '@/utils/getWeather';
import moment from 'moment';

const styles = StyleSheet.create({
    OuterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 10,
    },
    InnerContainer: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        width: 85,
        marginTop: 10,
        marginHorizontal: 2,
        marginBottom: 20,
        borderRadius: 15,
        padding: 5,
        alignItems: 'center',
        height: 500,
        flex: 1,
        justifyContent: 'space-between'
    },
    todaysInnerContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    dayNameText: {
        fontSize: 12,
        color: "white",
        textAlign: 'center',
        marginBottom: 5
    },
    tempText: {
        fontSize: 14,
        color: "white",
        marginTop: 5
    },
    windText: {
        fontSize: 10,
        color: "white",
        marginTop: 2
    },
    icon: {
        width: 30,
        height: 30,
        marginBottom: 5,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    BottomElems:{
        paddingVertical: 10,    
    }
});

export default class DayInfo extends Component<{ weather: string, date_: string, airSpeed: string, isToday: boolean }> {
    render() {
        const { date_, isToday, weather, airSpeed } = this.props;
        
        let displayDate;
        if (isToday) {
            displayDate = 'Today';
        } else {
            const date = moment(date_, 'DD-MM-YYYY');
            const tomorrow = moment().add(1, 'days').startOf('day');
            if (date.isSame(tomorrow, 'day')) {
                displayDate = 'Tomorrow';
            } else {
                displayDate = date.format('ddd');
            }
        }

        return (
            <View style={[styles.InnerContainer, isToday && styles.todaysInnerContainer]}>
                <View>
                    <Text style={styles.dayNameText}>
                        {displayDate}
                    </Text>
                    {getWeatherIcon(weather, styles)}
                </View>
                <View style={[styles.BottomElems]}>
                    {getWeatherIcon(weather, styles, false)}
                    <Text style={styles.windText}>{`Wind: ${airSpeed} m/s`}</Text>
                </View>
            </View>
        );
    }
}
