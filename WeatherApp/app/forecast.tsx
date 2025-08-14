// import { Ionicons } from '@expo/vector-icons';

// import Constants from 'expo-constants';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import React from 'react';
// import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { LineChart } from 'react-native-gifted-charts';
// import DayInfo from '../Components/DayInfo';


// const styles = StyleSheet.create({
//     OuterContainer: {
//         flexDirection: 'row',
//         width: 445, // Increased width for scrolling
//         height: 450,
//         // paddingHorizontal: 10,
//     },
//     BackgroundContainer: {
//         flex: 1,
//         flexDirection: 'column',
//         backgroundColor: 'black',
//         paddingTop: Constants.statusBarHeight,
//     },
//     ChartContainer: {
//         position: 'absolute',
//         top: 80,
//         left: -20,
//         width: 500, // Match OuterContainer width
//         height: 300,
//         zIndex: 1, // Ensures chart is on top
        
//     },
//     DayInfoContainer: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         width: 500, // Match OuterContainer width
//         height: 400,
//         zIndex: 0, // Ensures DayInfo is below chart
//     },
//     ScrollContainer: {
//         // position: 'absolute',
//         // marginTop: 5,
//         // width: 800,
//         height: 450,
//     },
//     DayInfoItem: {
//         flex: 1,
//         alignItems: 'center', // Center content horizontally within each DayInfo
//     }
// });

// export default function ForecastScreen() {
//     const router = useRouter()
//     const params = useLocalSearchParams();

//     if (!params || !params.data || !params.city) {
//         return (
//             <View style={styles.BackgroundContainer}>
//                 <TouchableOpacity
//                     onPress={() => router.back()}
//                     style={{ paddingTop: Constants.statusBarHeight, paddingLeft: 10}}
//                 >
//                     <Ionicons name="arrow-back" size={24} color="white" />
//                 </TouchableOpacity>
//                 <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>Loading... Please wait</Text>
//             </View>
//         );
//     }

//     const { data, city } = params;
//     console.log("Forecast Data");
//     console.log(data);
//     console.log("City is ");
//     console.log(city);

//     const parsedData = JSON.parse(data as string);

//     if (!parsedData[city as string]) {
//         return (
//             <View style={styles.BackgroundContainer}>
//                 <TouchableOpacity
//                     onPress={() => router.back()}
//                     style={{ paddingTop: Constants.statusBarHeight, paddingLeft: 10}}
//                 >
//                     <Ionicons name="arrow-back" size={24} color="white" />
//                 </TouchableOpacity>
//                 <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>
//                     Could not find forecast data for {city}.
//                 </Text>
//             </View>
//         );
//     }

//     // Prepare data for Gifted Charts, aligning points to DayInfo centers
//     const dayInfoCount = 5; // Number of DayInfo components
//     const containerWidth = Dimensions.get('window').width * 1.5; // Total width of content
//     const spacing = containerWidth / dayInfoCount; // Space between DayInfo centers

//     const minTempData = Object.values(parsedData[city as string]).map((day: any) => ({ value: day.avg_temp_min, dataPointText: `${day.avg_temp_min}°` }));
//     const maxTempData = Object.values(parsedData[city as string]).map((day: any) => ({ value: day.avg_temp_max, dataPointText: `${day.avg_temp_max}°` }));

//     const allDataValues = [...minTempData.map(d => d.value), ...maxTempData.map(d => d.value)];
//     console.log(allDataValues)
//     let maxValue = Math.max(...allDataValues);
//     let mostNegativeValue = Math.min(...allDataValues);

//     const tempRange = maxValue - mostNegativeValue;
//     const minRange = 10; 

//     if (tempRange < minRange) {
//         const diff = (minRange - tempRange) / 2;
//         maxValue += diff;
//         mostNegativeValue -= diff;
//     }

//     maxValue += 5;
//     mostNegativeValue -= 5;

//     const dayInfoData = Object.keys(parsedData[city as string]).map((date, index) => ({
//         weather: parsedData[city as string][date].weather,
//         date_: date,
//         airSpeed: parsedData[city as string][date].avg_wind_speed,
//         isToday: index === 0,
//     }));

//     const renderDayInfoComponents = (dayInfoData) => {
//         return dayInfoData.map((data, index) => (
//             <View style={styles.DayInfoItem} key={index}>
//                 <DayInfo
//                     weather={data.weather}
//                     date_={data.date_}
//                     airSpeed={data.airSpeed}
//                     isToday={data.isToday}
//                 />
//             </View>
//         ));
//     };


//     return (
//         <View style={styles.BackgroundContainer}>
//             <TouchableOpacity
//                 onPress={() => router.back()}
//                 style={{ paddingTop: Constants.statusBarHeight, paddingLeft: 10}}
//             >
//                 <Ionicons name="arrow-back" size={24} color="white" />
//             </TouchableOpacity>
//             <Text style={{ color: 'white', fontSize: 35, marginVertical: 10, padding: 5,}}>
//                 5-Day Forecast
//             </Text>
//             <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 style={styles.ScrollContainer}
//             >
//                 <View style={{ position: 'relative', height: 300, width: containerWidth }}>
//                     <View style={styles.DayInfoContainer}>
//                         <View style={styles.OuterContainer}>
//                             {renderDayInfoComponents(dayInfoData)}
//                         </View>
//                     </View>
//                     <View style={styles.ChartContainer}>
//                         <LineChart
//                             data={minTempData}
//                             data2={maxTempData}
//                             maxValue={maxValue}
//                             mostNegativeValue={mostNegativeValue}
//                             yAxisOffset={mostNegativeValue}
//                             width={500} // Match content width minus padding
//                             height={250}
//                             curved
//                             isAnimated
//                             color1="#ffa726"
//                             color2="#ffffff"
//                             thickness={2}
//                             dataPointsRadius={3}
//                             dataPointsColor1="#ffa726"
//                             dataPointsColor2="#ffffff"
//                             yAxisTextStyle={{ color: 'white' }}
//                             yAxisSuffix="°"
//                             yAxisThickness={0}
//                             hideAxesAndRules={true} // Hide x and y axis labels and lines
//                             hideRules={true} // Hide horizontal grid lines
//                             xAxisThickness={0}
//                             noOfSections={5}
//                             textFontSize={12}
//                             textColor="white"
//                             spacing={75} // Align data points to DayInfo centers
//                             // initialSpacing={spacing / 2} // Center first point over first DayInfo
//                             dataPointLabelTextStyle={{ color: 'white', fontSize: 12 }}
//                             textShiftY={5}
//                             textShiftX={20}
//                             style={{
//                                 marginVertical: 8,
//                                 borderRadius: 10,
//                             }}
//                         />
//                     </View>
//                 </View>
//             </ScrollView>
//         </View>
//     );
// }
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import DayInfo from '../Components/DayInfo';

const styles = StyleSheet.create({
    OuterContainer: {
        flexDirection: 'row',
        width: 550,
        height: 450,
    },
    BackgroundContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
        paddingTop: Constants.statusBarHeight,
    },
    ChartContainer: {
        position: 'absolute',
        top: 80,
        left: -20,
        width: 550,
        height: 30,
        zIndex: 1,
    },
    DayInfoContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 550,
        height: 400,
        zIndex: 0,
    },
    ScrollContainer: {
        height: 450,
    },
    DayInfoItem: {
        flex: 1,
        alignItems: 'center',
    }
});

export default function ForecastScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    if (!params || !params.data || !params.city) {
        return (
            <View style={styles.BackgroundContainer}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ paddingTop: Constants.statusBarHeight, paddingLeft: 10}}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>Loading... Please wait</Text>
            </View>
        );
    }

    const { data, city } = params;
    console.log("Forecast Data");
    console.log(data);
    console.log("City is ");
    console.log(city);

    const parsedData = JSON.parse(data as string);

    if (!parsedData[city as string]) {
        return (
            <View style={styles.BackgroundContainer}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ paddingTop: Constants.statusBarHeight, paddingLeft: 10}}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>
                    Could not find forecast data for {city}.
                </Text>
            </View>
        );
    }

    const dayInfoCount = 5;
    const containerWidth = Dimensions.get('window').width * 1.5;
    const spacing = containerWidth / dayInfoCount;

    const minTempData = Object.values(parsedData[city as string]).map((day: any) => ({ value: day.avg_temp_min, dataPointText: `${day.avg_temp_min}°` }));
    const maxTempData = Object.values(parsedData[city as string]).map((day: any) => ({ value: day.avg_temp_max, dataPointText: `${day.avg_temp_max}°` }));

    const allDataValues = [...minTempData.map(d => d.value), ...maxTempData.map(d => d.value)];
    // Add 2 to max value and subtract 2 from min value
    const maxValue = Math.max(...allDataValues) + 2;
    const mostNegativeValue = Math.min(...allDataValues) - 2;

    const dayInfoData = Object.keys(parsedData[city as string]).map((date, index) => ({
        weather: parsedData[city as string][date].description,
        date_: date,
        airSpeed: parsedData[city as string][date].avg_wind_speed,
        isToday: index === 0,
    }));

    const renderDayInfoComponents = (dayInfoData) => {
        console.log("Day Info Data: ", dayInfoData);
        return dayInfoData.map((data, index) => (
            <View style={styles.DayInfoItem} key={index}>
                <DayInfo
                    weather={data.weather}
                    date_={data.date_}
                    airSpeed={data.airSpeed}
                    isToday={data.isToday}
                />
            </View>
        ));
    };

    return (
        <View style={styles.BackgroundContainer}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={{ paddingTop: Constants.statusBarHeight, paddingLeft: 10}}
            >
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={{ color: 'white', fontSize: 35, marginVertical: 10, padding: 5,}}>
                5-Day Forecast
            </Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.ScrollContainer}
            >
                <View style={{ position: 'relative', height: 300, width: containerWidth }}>
                    <View style={styles.DayInfoContainer}>
                        <View style={styles.OuterContainer}>
                            {renderDayInfoComponents(dayInfoData)}
                        </View>
                    </View>
                    <View style={styles.ChartContainer}>
                        <LineChart
                            data={minTempData}
                            data2={maxTempData}
                            maxValue={maxValue}
                            mostNegativeValue={mostNegativeValue}
                            yAxisOffset={mostNegativeValue}
                            width={500}
                            height={250}
                            curved
                            isAnimated
                            color1="#ffa726"
                            color2="#ffffff"
                            thickness={2}
                            dataPointsRadius={3}
                            dataPointsColor1="#ffa726"
                            dataPointsColor2="#ffffff"
                            yAxisTextStyle={{ color: 'white' }}
                            yAxisSuffix="°"
                            yAxisThickness={0}
                            hideAxesAndRules={true}
                            hideRules={true}
                            xAxisThickness={0}
                            noOfSections={5}
                            textFontSize={12}
                            textColor="white"
                            spacing={95}
                            dataPointLabelTextStyle={{ color: 'white', fontSize: 12 }}
                            textShiftY={5}
                            textShiftX={20}
                            style={{
                                marginVertical: 8,
                                borderRadius: 10,
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}