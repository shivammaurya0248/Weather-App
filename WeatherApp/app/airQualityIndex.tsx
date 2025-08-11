import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import moment from 'moment';

const styles = StyleSheet.create({
  MainHeading: {
    fontSize: 40,
    color: 'white',
  },
  SubHeading: {
    fontSize: 15,
    color: 'white',
  },
  p10: {
    padding: 10,
  },
  MainAQI: {
    fontSize: 40,
  },
  AQIContainer: { padding: 10 },

  GoodAQI: { color: 'green' },
  FairAQI: { color: 'yellow' },
  ModerateAQI: { color: 'orange' },
  PoorAQI: { color: 'red' },
  VeryPoorAQI: { color: 'purple' },

  PartValue: {
    fontSize: 20,
  },
  PartHeading: {
    alignContent: 'center',
    justifyContent: 'center',
    fontSize: 15,
    color: 'gray',
  },
  BackgroundContainer: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "black",
    flex: 1,
  },
  ParticulateContainer: {
    flexWrap: 'wrap',
    width: Dimensions.get('window').width,
    justifyContent: 'space-around',
    alignContent: 'space-around',
    flexDirection: 'row',
    padding: 5,
  },
  ParticulateInnerContainer: {
    padding: 10,
  },
  SuperScript: {
    fontSize: 15,
    lineHeight: 18,
  },
  SubScript: {
    fontSize: 8,
    lineHeight: 23,
  }
})

export default function AirQualityIndex() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const AQIDataString = params.AQIData as string;
  const City = params.City as string;

  if (!AQIDataString) {
    return (
      <View style={styles.BackgroundContainer}>
        <Text style={{ color: 'white', padding: 10 }}>Loading...</Text>
      </View>
    );
  }

  const Data = JSON.parse(AQIDataString);

  if (!Data || Object.keys(Data).length === 0) {
    return (
      <View style={styles.BackgroundContainer}>
        <Text style={{ color: 'white', padding: 10 }}>No AQI data available.</Text>
      </View>
    );
  }

  const publish_time = Data.published_at ? moment(Data.published_at).format("HH:mm") : "N/A";

  function getAQIDescription(aqi: number): any {
    switch (aqi) {
        case 1: return (
            <View style={styles.AQIContainer}>
                <Text style={[styles.MainAQI, styles.GoodAQI]}>Good</Text>
                <Text style={styles.SubHeading}>Air quality is satisfactory, and air pollution poses little or no risk.</Text>
            </View>
        );
        case 2: return (
            <View style={styles.AQIContainer}>
                <Text style={[styles.MainAQI, styles.FairAQI]}>Fair</Text>
                <Text style={styles.SubHeading}>Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.</Text>
            </View>
        );
        case 3: return (
            <View style={styles.AQIContainer}>
                <Text style={[styles.MainAQI, styles.ModerateAQI]}>Moderate</Text>
                <Text style={styles.SubHeading}>Members of sensitive groups may experience health effects. The general public is less likely to be affected.</Text>
            </View>
        );
        case 4: return (
            <View style={styles.AQIContainer}>
                <Text style={[styles.MainAQI, styles.PoorAQI]}>Poor</Text>
                <Text style={styles.SubHeading}>Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.</Text>
            </View>
        );
        case 5: return (
            <View style={styles.AQIContainer}>
                <Text style={[styles.MainAQI, styles.VeryPoorAQI]}>Very Poor</Text>
                <Text style={styles.SubHeading}>Health alert: The risk of health effects is increased for everyone.</Text>
            </View>
        );
        default: return (
            <View style={styles.AQIContainer}>
                <Text style={[styles.MainAQI]}>Unknown</Text>
                <Text style={styles.SubHeading}>No information available for this AQI value.</Text>
            </View>
        );
    }
  }

  // Function to determine color based on pollutant value (green for safe, orange for dangerous)
  function getPollutantColor(pollutant: string, value: number): any {
    switch (pollutant) {
      case 'pm2_5':
        return value <= 35.4 ? styles.GoodAQI : styles.ModerateAQI
      case 'pm10':
        return value <= 50 ? styles.GoodAQI : styles.ModerateAQI
      case 'so2':
        return value <= 75 ? styles.GoodAQI : styles.ModerateAQI
      case 'no':
        return value <= 90 ? styles.GoodAQI : styles.ModerateAQI
      case 'no2':
        return value <= 80 ? styles.GoodAQI : styles.ModerateAQI
      case 'nh3':
        return value <= 200 ? styles.GoodAQI : styles.ModerateAQI
      case 'o3':
        return value <= 100 ? styles.GoodAQI : styles.ModerateAQI
      case 'co':
        return value <= 9.4 ? styles.GoodAQI : styles.ModerateAQI
      default:
        return styles.GoodAQI
    }
  }

  return (

    <View style={styles.BackgroundContainer}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ paddingTop: Constants.statusBarHeight, paddingLeft: 10}}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <View style={[styles.AQIContainer]}>
        <Text style={styles.MainHeading}>Air Quality Index</Text>
        <Text style={styles.SubHeading}>{City} Published at {publish_time}</Text>
      </View>
      {getAQIDescription(Data.aqi)}
      <Text style={[styles.SubHeading, styles.p10]}>Particulate Info</Text>
      <View style={[styles.ParticulateContainer]}>
        <View style={[styles.ParticulateInnerContainer, styles.p10]}>
          <Text style={[styles.PartValue, getPollutantColor('pm2_5', Data.pm2_5)]}>{Data.pm2_5}</Text>
          <Text style={[styles.PartHeading]}>PM 2.5</Text>
        </View>

        <View style={[styles.ParticulateInnerContainer, styles.p10]}> 
          <Text style={[styles.PartValue, getPollutantColor('pm10', Data.pm10)]}>{Data.pm10}</Text>
          <Text style={[styles.PartHeading]}>PM 10</Text>
        </View>

        <View style={[styles.ParticulateInnerContainer, styles.p10]}>
          <Text style={[styles.PartValue, getPollutantColor('so2', Data.so2)]}>{Data.so2}</Text>
          <Text style={[styles.PartHeading]}>SO<Text style={[styles.SubScript]}>2</Text></Text>
        </View>

        <View style={[styles.ParticulateInnerContainer, styles.p10]}>
          <Text style={[styles.PartValue, getPollutantColor('co', Data.co)]}>{Data.co}</Text>
          <Text style={[styles.PartHeading]}>CO</Text>
        </View>
      </View>
      <View style={[styles.ParticulateContainer, styles.p10]}>
        <View style={[styles.ParticulateInnerContainer]}>
          <Text style={[styles.PartValue, getPollutantColor('no', Data.no)]}>{Data.no}</Text>
          <Text style={[styles.PartHeading]}>NO</Text>
        </View>

        <View style={[styles.ParticulateInnerContainer, styles.p10]}>
          <Text style={[styles.PartValue, getPollutantColor('no2', Data.no2)]}>{Data.no2}</Text>
          <Text style={[styles.PartHeading]}>NO<Text style={[styles.SubScript]}>2</Text></Text>
        </View>

        <View style={[styles.ParticulateInnerContainer, styles.p10]}>
          <Text style={[styles.PartValue, getPollutantColor('nh3', Data.nh3)]}>{Data.nh3}</Text>
          <Text style={[styles.PartHeading]}>NH<Text style={[styles.SubScript]}>3</Text></Text>
        </View>

        <View style={[styles.ParticulateInnerContainer, styles.p10]}>
          <Text style={[styles.PartValue, getPollutantColor('o3', Data.o3)]}>{Data.o3}</Text>
          <Text style={[styles.PartHeading]}>O<Text style={[styles.SubScript]}>3</Text></Text>
        </View>

      </View>
    </View>
  )
}