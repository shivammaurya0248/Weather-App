import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import SunSliderSimple from './sunSliderCustom'


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 400,
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
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  innerCard: {
    width: '45%',
    height: 80,
    color: 'red',
    borderRadius: 10,
    padding: 10,
  },
  HeadingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  ValueText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  }
})

export default class DetailViewPage extends React.Component <{data: any}>{

  constructor(props: any) {
    super(props);
    this.state = {
      data: props.data,
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <SunSliderSimple sunrise={this.props.data.sunrise} sunset={this.props.data.sunset} />
        <View style={styles.innerContainer}>
          <View style={styles.innerCard}>
            <Text style={styles.HeadingText}>Real Feel</Text>
            <Text style={styles.ValueText}>{this.props.data.feels_like}°C</Text>
          </View>
          <View style={styles.innerCard}>
            <Text style={styles.HeadingText}>Humidity</Text>
            <Text style={styles.ValueText}>{this.props.data.humidity}%</Text>
          </View>
        </View>

        <View style={styles.innerContainer}>
          <View style={styles.innerCard}>
            <Text style={styles.HeadingText}>Chance of Rain</Text>
            <Text style={styles.ValueText}>{Math.floor(this.props.pop) || 0}%</Text>
          </View>
          <View style={styles.innerCard}>
            <Text style={styles.HeadingText}>Pressure</Text>
            <Text style={styles.ValueText}>{this.props.data.pressure} mbar</Text>
          </View>
        </View>

        <View style={styles.innerContainer}>
          <View style={styles.innerCard}>
            <Text style={styles.HeadingText}>Wind Speed</Text>
            <Text style={styles.ValueText}>{this.props.data.wind_speed} Km/h</Text>
          </View>
          <View style={styles.innerCard}>
            <Text style={styles.HeadingText}>UV Index</Text>
            <Text style={styles.ValueText}>0</Text>
          </View>
        </View>
      </View>
    )
  }
}