import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { Component } from "react";
import { ScrollView, StyleSheet, View, Text, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { get5DayForecast, getAQI, getCurrentDayWeather, get5DayForecastHourly } from '../utils/api';
import moment from 'moment';

import AQIInfo from '@/Components/AQIInfo';
import DetailViewPage from '@/Components/DetailViewPage';
import HourForcast from '@/Components/hourForcast';
import { router } from 'expo-router';
import FiveDayForecastButton from '../Components/5dayforecastButton';
import AQI from '../Components/AQI';
import CityName from '../Components/cityName';
import CurrentDayTemp from '../Components/CurrentDayTemp';
import DayWiseInfoRow from '../Components/dayWiseInfoRow';
import Weather from '../Components/weather';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Constants.statusBarHeight,
    },
    background: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Constants.statusBarHeight,
        flex: 1,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    forecastContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: 300,
        width: '100%',
    },
    scrollView: {
        width: '100%',
    },
    forecastScreenButton: {
        marginTop: 10,
        width: '100%',
        height: 50,
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

})


export default class MainScreen extends Component {
    state = {
        forecast5DayDataAverage: {},
        forecast5DayDataHourly: [],
        currentDayWeatherData: {},
        AQIData: {},
        cityName: "Loading...",
        pincode: null,
        location: null,
        latitude: 0,
        longitude: 0,
        errorMsg: null,
        pop: 0,
        isRefreshing: false,
        isLoading: true,
    };

    intervalID = null;

    componentDidMount() {
        this.fetchWeatherData();
        this.intervalID = setInterval(this.fetchWeatherData, 1800000); // 30 minutes
    }

    componentWillUnmount() {
        if (this.intervalID) {
            clearInterval(this.intervalID);
        }
    }

    onRefresh = async () => {
        this.setState({ isRefreshing: true });
        await this.fetchWeatherData();
        this.setState({ isRefreshing: false });
    };

    fetchWeatherData = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                this.setState({ errorMsg: 'Permission to access location was denied', isLoading: false });
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            const address = await Location.reverseGeocodeAsync({ latitude, longitude });
            // todo add city state and country with postal state to create a unique key for the city
            const city = address[0]?.city || "Unknown City";
            const postalCode = address[0]?.postalCode || null;
            const country = address[0]?.country || "Unknown Country";
            
            console.log(address);
            const cityKey = `${city}-${country}-${postalCode}`;
            console.log(`Fetching weather data for: ${cityKey}`);
            const currentDate = moment().format('DD-MM-YYYY')

            // Fetch all data in parallel once location is available
            const [currentDayWeatherData, forecast5DayData, AQIData, forecast5DayDataHourly] = await Promise.all([
                getCurrentDayWeather(latitude, longitude, cityKey),
                get5DayForecast(latitude, longitude, cityKey),
                getAQI(latitude, longitude, cityKey),
                get5DayForecastHourly(latitude, longitude, cityKey),
            ]);
            for(let i=0; i < 1000000; i++){
                // This is a placeholder for any heavy computation or processing that might be needed.
                // It simulates a delay in processing to ensure the UI remains responsive.
            }
            this.setState({
                latitude,
                longitude,
                location,
                currentDayWeatherData,
                forecast5DayDataAverage: forecast5DayData,
                AQIData,
                forecast5DayDataHourly,
                cityName: currentDayWeatherData.city || '',
                ActualCityName: city,
                pincode: postalCode,
                pop: forecast5DayData[currentDayWeatherData.city][currentDate]['avg_pop'] * 100 || 0,
                isLoading: false,
                errorMsg: null,
            });

        } catch (error) {
            console.error('Error fetching weather data:', error);
            this.setState({ errorMsg: 'Error fetching weather data', isLoading: false });
        }
    };

    render() {
        if (this.state.isLoading) {
            return (
                <LinearGradient
                    colors={['#0fb4d1', '#343374', '#9c77c6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.background}
                >
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={{color: 'white', marginTop: 10}}>Fetching Weather Data...</Text>
                </LinearGradient>
            );
        }

        const { ActualCityName, cityName, currentDayWeatherData, forecast5DayDataAverage, forecast5DayDataHourly, AQIData } = this.state;
        
        const cityForecastData = forecast5DayDataAverage ? forecast5DayDataAverage[cityName] : null;

        const forecastKeys = cityForecastData ? Object.keys(cityForecastData).sort((a, b) => {
            const dateA = new Date(a.split('-').reverse().join('-')).getTime();
            const dateB = new Date(b.split('-').reverse().join('-')).getTime();
            return dateA - dateB;
        }) : [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayKeyIndex = forecastKeys.findIndex(key => {
            const keyDate = new Date(key.split('-').reverse().join('-'));
            keyDate.setHours(0, 0, 0, 0);
            return keyDate.getTime() === today.getTime();
        });

        const tomorrowIndex = todayKeyIndex !== -1 ? todayKeyIndex + 1 : 0;
        const dayAfterTomorrowIndex = tomorrowIndex + 1;

        const todayData = cityForecastData && forecastKeys[todayKeyIndex] ? cityForecastData[forecastKeys[todayKeyIndex]] : null;
        const tomorrowData = cityForecastData && forecastKeys[tomorrowIndex] ? cityForecastData[forecastKeys[tomorrowIndex]] : null;
        const dayAfterTomorrowData = cityForecastData && forecastKeys[dayAfterTomorrowIndex] ? cityForecastData[forecastKeys[dayAfterTomorrowIndex]] : null;

        const getDayName = (dateString: string) => {
            if (!dateString) return '...';
            const date = new Date(dateString.split('-').reverse().join('-'));
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        };

        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.container} edges={['top']}>
                    <LinearGradient
                        colors={['#0fb4d1', '#343374', '#9c77c6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.background}
                    >
                        <ScrollView
                            style={styles.scrollView}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this.onRefresh}
                                    tintColor="#fff"
                                    colors={['#fff']}
                                />
                            }
                        >
                            <View style={styles.container}>
                                <CityName cityName={ActualCityName} />
                                <CurrentDayTemp currentDayData={currentDayWeatherData} />
                                <Weather currentDayData={currentDayWeatherData} />
                                <AQI AQIData={AQIData} />
                            </View>
                            <View style={styles.forecastContainer}>
                                <DayWiseInfoRow
                                    day="Today" 
                                    temp={todayData  ? `${Math.round(todayData.avg_temp_max)}°/${Math.round(todayData.avg_temp_min)}°` : '--°/--°'} 
                                    weather={currentDayWeatherData.weather || '...'}
                                />
                                <DayWiseInfoRow
                                    day="Tomorrow"
                                    temp={tomorrowData ? `${Math.round(tomorrowData.avg_temp_max)}°/${Math.round(tomorrowData.avg_temp_min)}°` : '--°/--°'}
                                    weather={tomorrowData ? tomorrowData.weather : '...'}
                                />
                                <DayWiseInfoRow
                                    day={getDayName(forecastKeys[dayAfterTomorrowIndex])}
                                    temp={dayAfterTomorrowData ? `${Math.round(dayAfterTomorrowData.avg_temp_max)}°/${Math.round(dayAfterTomorrowData.avg_temp_min)}°` : '--°/--°'}
                                    weather={dayAfterTomorrowData ? dayAfterTomorrowData.weather : '...'}
                                />
                                <FiveDayForecastButton onPress={() => {
                                    router.push({
                                        pathname: '/forecast',
                                        params: {
                                            data: JSON.stringify(forecast5DayDataAverage),
                                            city: cityName,
                                        }
                                    });
                                }} />
                            </View>
                            <HourForcast data={forecast5DayDataHourly} />
                            <DetailViewPage data={currentDayWeatherData} pop={this.state.pop}/>
                            <AQIInfo AQIData={AQIData} City={ActualCityName} />
                        </ScrollView>
                    </LinearGradient>
                </SafeAreaView>
            </SafeAreaProvider>
        )
    }
}