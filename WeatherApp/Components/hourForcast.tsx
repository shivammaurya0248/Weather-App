/* eslint-disable */
import React, { Component } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getWeatherIcon } from "../utils/getWeather";

// Define interfaces for type safety
interface WeatherData {
    time_: string;
    temp: string;
    weather: string;
    wind_speed: string;
}

interface HourForcastProps {
    data: [string, WeatherData][];
}

interface HourForcastState {
    // Add state properties if needed
}

const styles = StyleSheet.create({
    text: {
        color: 'white',
        fontSize: 14,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    iconAirFlow:{
        padding: 10,
        height: 30, 
        width: 30,
        overflow: 'visible',
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    textWindSpeed:{
        color: 'white',
    },
    icon:{
        marginHorizontal: 5,
        height: 30,
        width: 30,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    horizontalScrollContainer: {
        flex: 1,
        width: '100%',
        height: 200,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        marginLeft:10,
        height: 130, 
        width: 130,
        borderRadius: 10,
        overflow: 'visible',
        resizeMode: 'contain',
        alignSelf: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    windContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'space-between',
    }
})


export default class HourForcast extends Component<HourForcastProps, HourForcastState>{
    state: HourForcastState = {

    }
    getHourlyForecastComponentsToRender = (transform5DayForecastHourly: [string, WeatherData][]) => {
        let temp: React.ReactElement[] = [];
        if(transform5DayForecastHourly.length > 0){
            const actual_data_list = transform5DayForecastHourly.slice(1);
            actual_data_list.map((item: [WeatherData], index: number) => {
                let day = item[0].date_.split('-')[0];
                let month = item[0].date_.split('-')[1];
                console.log(item);
                temp.push(
                    <View key={index} style={styles.container}>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{day}/{month}</Text>
                            <Text style={styles.text}>{item[0].time_}</Text>
                        </View>
                        <Text style={styles.text}>{item[0].temp}°C</Text>
                        {getWeatherIcon(item[0].description, styles)}
                        <View style={styles.windContainer}>
                            <Image source={require('../assets/icons/AirFlow.png')} style={styles.icon} />
                            <Text style={styles.textWindSpeed}>{item[0].wind_speed} km/h</Text>
                        </View>
                    </View>
                )
            })
        }
        return temp;
    }

    render(){
        return(
            <ScrollView horizontal={true} style={styles.horizontalScrollContainer} showsHorizontalScrollIndicator={false} contentContainerStyle={{ 
                    flexDirection: 'row',
                alignItems: 'center', 
                justifyContent: 'center' 
            }}
        >
            {this.getHourlyForecastComponentsToRender(this.props.data)}

            
        </ScrollView>
    );
    }
}