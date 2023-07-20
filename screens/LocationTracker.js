import {
  StyleSheet,
  Alert,
  View,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
  Accuracy,
} from 'expo-location';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  deleteDoc,
  setDoc,
} from 'firebase/firestore';
import MapView, { Marker } from 'react-native-maps';
import { Button } from 'react-native-paper';
import { app, db } from '../lib/firebase';

import { getAuth, signOut } from 'firebase/auth';
import { AuthContext } from '../context/AuthContext';
const { width } = Dimensions.get('window');
const LocationTracker = () => {
  const auth = getAuth(app);
  const { user, uid } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [locationIsOn, setLocationIsOn] = useState(false);
  const [isExists, setIsExists] = useState(false);
  const [id, setId] = useState('');

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
      accuracy: Accuracy.BestForNavigation,
      distanceInterval: 10,
    });

    const { coords } = location;

    setMapRegion({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });

    setIsLoading(true);
    try {
      await setDoc(doc(db, 'location', uid), {
        latitude: mapRegion.latitude,
        longitude: mapRegion.longitude,
        email: user,
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    } finally {
      setIsLoading(false);
      setLocationIsOn(true);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const hasPermission = await verifyPermission();

      if (!hasPermission) return;
      const location = await getCurrentPositionAsync({
        accuracy: Accuracy.BestForNavigation,
        distanceInterval: 10,
      });

      const { coords } = location;

      setMapRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      try {
        await setDoc(doc(db, 'location', uid), {
          latitude: mapRegion.latitude,
          longitude: mapRegion.longitude,
          email: user,
        });
      } catch (e) {
        console.error('Error adding document: ', e);
      }
      console.log('reading');
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  const toggleLocation = () => {
    setLocationIsOn((prev) => !prev);
    deleteDoc(doc(db, 'location', uid))
      .then((response) =>
        ToastAndroid.showWithGravityAndOffset(
          'Location Turned off, Click get your location to get your updated location',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50
        )
      )
      .catch((error) => console.log(error));
  };
  console.log(id);
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
        ToastAndroid.showWithGravityAndOffset(
          'An error occurred',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50
        );
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
          <Marker coordinate={mapRegion} title={'marker'} />
        </MapView>
      )}
      <View
        style={{
          marginTop: 15,
          flexDirection: 'row',
          columnGap: 10,
          paddingHorizontal: 20,
          justifyContent: 'center',
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
