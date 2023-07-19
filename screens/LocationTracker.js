import {
  StyleSheet,
  Text,
  Alert,
  View,
  Dimensions,
  Pressable,
  ToastAndroid,
} from 'react-native';
import React, { useContext, useState } from 'react';

import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
  Accuracy,
} from 'expo-location';
import { collection, addDoc, getDoc } from 'firebase/firestore';
import MapView, { Marker } from 'react-native-maps';
import { Button } from 'react-native-paper';
import { app, db } from '../lib/firebase';

import { getAuth, signOut } from 'firebase/auth';
import { AuthContext } from '../context/AuthContext';
const { width } = Dimensions.get('window');
const LocationTracker = () => {
  const auth = getAuth(app);
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [locationIsOn, setLocationIsOn] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 5.47631,
    longitude: 7.025853,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();
  const verifyPermission = async () => {
    if (
      locationPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }
    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Insufficient permissions!',
        'You need to grant location permission to use this app.'
      );

      return false;
    }

    return true;
  };

  const handleGetLocation = async () => {
    const hasPermission = await verifyPermission();

    if (!hasPermission) return;
    const location = await getCurrentPositionAsync({
      accuracy: Accuracy.Highest,
    });

    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });

    setIsLoading(true);
    try {
      const docs = await addDoc(collection(db, 'location'), {
        latitude: mapRegion.latitude,
        longitude: mapRegion.longitude,
        name: user,
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    } finally {
      setIsLoading(false);
      setLocationIsOn(true);
    }
  };
  const toggleLocation = () => {
    setLocationIsOn((prev) => !prev);
  };

  const logOut = () => {
    signOut(auth)
      .then(() => {
        ToastAndroid.showWithGravityAndOffset(
          'Signed out',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50
        );
      })
      .catch((error) => {
        Alert.alert('An error occurred');
      });
  };

  return (
    <View style={{ flex: 1 }}>
      {locationIsOn ? (
        <MapView style={styles.map} region={mapRegion}>
          <Marker coordinate={mapRegion} title={user} />
        </MapView>
      ) : (
        <MapView
          style={styles.map}
          region={{
            latitude: 5.47631,
            longitude: 7.025853,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={mapRegion} title="marker" />
        </MapView>
      )}
      <View
        style={{
          marginTop: 15,
          flexDirection: 'row',
          columnGap: 10,
          paddingHorizontal: 20,
        }}
      >
        <Button
          loading={isLoading}
          icon="map-marker"
          mode="contained"
          onPress={handleGetLocation}
        >
          Get My location
        </Button>
        <Button mode="contained" onPress={toggleLocation}>
          {locationIsOn ? 'Turn off my location' : 'Turn on my location'}
        </Button>
      </View>
      <Button
        mode="outlined"
        style={{ marginTop: 10, marginHorizontal: 20 }}
        onPress={logOut}
      >
        Log out
      </Button>
    </View>
  );
};

export default LocationTracker;

const styles = StyleSheet.create({
  map: {
    width: width,
    height: '80%',
  },
});
