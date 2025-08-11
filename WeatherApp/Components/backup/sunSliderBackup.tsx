import React from "react";
import { View, StyleSheet, Text, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import moment from 'moment';

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 10,
        margin: 10,
    },
    labelContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    labelText: {
        color: 'white',
        fontSize: 13,
    },
    labelTime: {
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
    }
})

type SimpleCurveProps = {
    /** 
     * progress: number between 0 and 1, where 0 is sunrise (left), 1 is sunset (right)
     */
    sunrise: string;
    sunset: string;
};

function getCubicBezierXYatT(start: {x: number, y: number}, c1: {x: number, y: number}, c2: {x: number, y: number}, end: {x: number, y: number}, t: number) {
    // Cubic Bezier formula
    const x = Math.pow(1 - t, 3) * start.x +
              3 * Math.pow(1 - t, 2) * t * c1.x +
              3 * (1 - t) * Math.pow(t, 2) * c2.x +
              Math.pow(t, 3) * end.x;
    const y = Math.pow(1 - t, 3) * start.y +
              3 * Math.pow(1 - t, 2) * t * c1.y +
              3 * (1 - t) * Math.pow(t, 2) * c2.y +
              Math.pow(t, 3) * end.y;
    return { x, y };
}

function SimpleCurve(props: SimpleCurveProps) {
    // Box: width=200, height=50
    // Start at (0,50), end at (200,50), control points for a smooth arch
    const width = 200;
    const height = 50;
    // Control points: arch up to the top middle
    const d = `M 0,${height} C ${width/3},0 ${2*width/3},0 ${width},${height}`;

    // Bezier points
    const start = { x: 0, y: height };
    const c1 = { x: width/3, y: 0 };
    const c2 = { x: 2*width/3, y: 0 };
    const end = { x: width, y: height };

    // Clamp progress between 0 and 1
    // const progress = Math.max(0, Math.min(1, props.progress ?? 0));

    // Get sun position along the curve

    // Function to calculate progress
    function calculateProgress() {
        // Expecting props.sunrise and props.sunset as "HH:mm" strings
        // Parse today's date with the given time
        const today = moment().format('YYYY-MM-DD');
        const sunriseStr = `${today} ${props.sunrise}`;
        const sunsetStr = `${today} ${props.sunset}`;
        const sunrise = moment(sunriseStr, 'YYYY-MM-DD HH:mm');
        const sunset = moment(sunsetStr, 'YYYY-MM-DD HH:mm');
        
        if (!sunrise.isValid() || !sunset.isValid()) {
            console.log(`Invalid date`);
            return 0;
        }

        const now = moment();
        const total_duration = sunset.diff(sunrise, 'minutes');
        const current_duration = now.diff(sunrise, 'minutes');

        let progress = current_duration / total_duration;
        // Clamp progress between 0 and 1
        progress = Math.max(0, Math.min(1, progress));

        console.log(`progress: ${progress}== ${current_duration} / ${total_duration}  -- ${sunrise.format('HH:mm')} to ${sunset.format('HH:mm')}`);
        return progress;
    }
    const [progress, setProgress] = React.useState(calculateProgress());

    React.useEffect(() => {
        const interval = setInterval(() => {
            setProgress(calculateProgress());
        }, 60000); // update every minute

        return () => clearInterval(interval);
    }, [props.sunrise, props.sunset]);

    let sunPos = getCubicBezierXYatT(start, c1, c2, end, progress);
    return (
        <View style={styles.Container}>
            <View style={{ width, height }}>
                <Svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0 }} {...props}>
                    <Path d={d} stroke="white" strokeWidth={2} fill="none" />
                </Svg>
                <Image
                    source={require('../assets/icons/SunSimple.png')}
                    style={{
                        width: 30,
                        height: 30,
                        position: 'absolute',
                        left: sunPos.x - 15, // Center the image horizontally
                        top: sunPos.y - 15,  // Center the image vertically
                    }}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.labelContainer}>
                <Text style={styles.labelText}>
                    Sunrise <Text style={styles.labelTime}>{props.sunrise}</Text>
                </Text>
                <Text style={styles.labelText}>
                    Sunset <Text style={styles.labelTime}>{props.sunset}</Text>
                </Text>
            </View>
        </View>
    );
}

export default class SunSliderSimple extends React.Component <{
    sunrise: string;
    sunset: string;
}> {

    render() {
        // You can pass sunrise/sunset as props if needed
        return (
            <View style={styles.Container}>
                <SimpleCurve sunrise={this.props.sunrise} sunset={this.props.sunset}/>
            </View>
        )
    }
}
