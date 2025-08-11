import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import DayInfo from "../Components/DayInfo";


const styles = StyleSheet.create({
    OuterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        height: 500,
        paddingHorizontal: 10,
    },
    BackgroundContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    }
})

export default function ForecastScreen() {
    const { data, city } = useLocalSearchParams();
    console.log("Forecast DAta")
    console.log(data)
    // console.log(typeof (data[1]))
    console.log("City is ")
    console.log(city)

    const parsedData = Object.values(data[1]);
    // const parsedData = []
    console.log("Parsed Forcast Data")
    // console.log(parsedData)
    // const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    // // const city = Object.keys(parsedData)[0]; // Dynamically get the city name
    // const dates = Object.keys(parsedData[city]).map(date => date.split('-').reverse().join('-')); // Convert to DD-MM format
    // const temps = Object.values(parsedData[city]).map((day: any) => day.avg_temp);
    // const minTemps = Object.values(parsedData[city]).map((day: any) => day.avg_temp_min);
    // const maxTemps = Object.values(parsedData[city]).map((day: any) => day.avg_temp_max);
    // const weatherConditions = Object.values(parsedData[city]).map((day: any) => day.weather);

    return (
        <View style={[styles.BackgroundContainer]}>
            <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', marginVertical: 10 }}>5-Day Forecast</Text>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <LineChart
                    data={{
                        labels:['1/2', '2/3', '4/5', '6/5', '7/8'],
                        datasets: [
                            {
                                data: [10,20,30,40,50],
                                color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})` // Orange line for avg temp
                            },
                            {
                                data: [60,30,60,30,60],
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})` // White line for max temp
                            },
                        ]
                    }}
                    width={Dimensions.get("window").width - 20} // Adjusted width
                    height={500}
                    yAxisLabel=""
                    yAxisSuffix="°"
                    yAxisInterval={5}
                    chartConfig={{
                        fillShadowGradientFromOpacity: 0,
                        fillShadowGradientToOpacity: 0,
                        fillShadowGradientFrom: 'rgba(255,255,255,0)',
                        color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        }
                    }}
                    bezier
                    decorator={
                        () => <View style={[styles.OuterContainer]}>
                                <DayInfo weather='rain' date_='12-07-2025' airSpeed='10' isToday={true}/>
                                <DayInfo weather='rain' date_='12-07-2025' airSpeed='10' isToday={false}/>
                                <DayInfo weather='rain' date_='12-07-2025' airSpeed='10' isToday={false}/>
                                <DayInfo weather='rain' date_='12-07-2025' airSpeed='10' isToday={false}/>
                                <DayInfo weather='rain' date_='12-07-2025' airSpeed='10' isToday={false}/>
                            </View>
                    }
                    withHorizontalLabels={false}
                    withVerticalLabels={true}
                    withInnerLines={false}
                    withOuterLines={false}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                        padding: 10,
                        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        // flex: 1,
                        // flexDirection: 'column',
                        // alignItems: 'center',
                    }}
                />
            </View>
        </View>
    )
}