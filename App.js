import React from "react";
import {
  StyleSheet,
  Text,
  View,
  YellowBox,
  PermissionsAndroid
} from "react-native";

import SocketIOClient from "socket.io-client";

var socket = SocketIOClient("http://shahchat.herokuapp.com/", { port: 5000 });
YellowBox.ignoreWarnings([
  "Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?"
]);

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      lat: null,
      lng: null
    };
  }

  watchers = null;

  componentDidMount() {
    navigator.geolocation.setRNConfiguration({
      config: true
    });

    let geoOptions = {
      enableHighAccuracy: true
    };
    this.watchers = navigator.geolocation.getCurrentPosition(
      this.getSuccess,
      this.geoFailure,
      geoOptions
    );
  }

  changeAdd = () => {
    let geoOptions = {
      enableHighAccuracy: true
    };
    this.watchers = navigator.geolocation.watchPosition(
      this.getSuccess,
      this.geoFailure,
      geoOptions
    );
    console.log("Clickwed");
  };

  getSuccess = position => {
    this.setState({
      lat: position.coords.longitude,
      lng: position.coords.latitude
    });

    socket.emit("msg", { message: this.state.lat, user: this.state.lng });

    console.log(this.state.lat);
    console.log(this.state.lng);
    setTimeout(this.changeAdd, 5000);
    this.clearNew();
  };

  geoFailure = err => {
    console.log(err);
  };

  clearNew = () => {
    navigator.geolocation.clearWatch(this.watchers);
  };

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchers);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.big}>{`Latitude: ${this.state.lat}
                    Longitude: ${this.state.lng}`}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  big: {
    fontSize: 25
  }
});
