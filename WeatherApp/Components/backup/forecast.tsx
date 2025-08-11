import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import DayInfo from "../Components/DayInfo";


export default class ForecastScreen extends React.Component<{ data: any }> {
    render() {
        return (
            <View>
                <Text>5-Day Forecast</Text>
                <View>
                    <LineChart
                        data={{
                            labels: ["January", "February", "March", "April", "May", "June"],
                            datasets: [
                                {
                                    data: [35, 33, 29, 31, 32]
                                },

                                {
                                    data: [24, 21, 22, 23, 25]
                                },

                            ]
                        }}
                        width={Dimensions.get("window").width} // from react-native
                        height={500}
                        // yAxisLabel="$"
                        // yAxisSuffix="k"
                        // yAxisInterval={1} // optional, defaults to 1
                        segments={0}

                        chartConfig={{
                            fillShadowGradientFromOpacity: 0,
                            fillShadowGradientToOpacity: 0,
                            fillShadowGradientFrom: 'rgba(255,255,255,0)',
                            // backgroundColor: "rgba(255,255,255,0.1)",
                            // backgroundGradientFrom: "#fb8c00",
                            // backgroundGradientTo: "#ffa726",
                            decimalPlaces: 2, // optional, defaults to 2dp
                            color: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
                            // style: {
                            //     borderRadius: 16
                            // },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: "#ffa726"
                            }
                        }}
                        bezier
                        decorator={() => (
                            <DayInfo />
                        )}
                        withHorizontalLabels={false}
                        withVerticalLabels={false}
                        withInnerLines={false}
                        withOuterLines={false}
                        style={{
                            marginVertical: 8,
                            borderRadius: 16
                        }}
                    />

                </View>
            </View>
        )
    }
}