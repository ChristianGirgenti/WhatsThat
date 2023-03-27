import { Camera, CameraType } from 'expo-camera';
import { useEffect, useState, React } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalStyle from '../styles/GlobalStyle';

export default function MyCamera() {
  const [type, setType] = useState(CameraType.back);
  const [camera, setCamera] = useState(null);
  const [permission, setPermission] = useState(null);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  function toggleCameraType() {
    setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
    console.log('Camera: ', type);
  }

  const permissionFunction = async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    setPermission(cameraPermission.status === 'granted');
  };

  useEffect(() => {
    permissionFunction();
  }, []);

  async function sendToServer(data) {
    const res = await fetch(data.uri);
    const blob = await res.blob();

    const userId = await AsyncStorage.getItem('whatsthat_user_id');
    fetch(
      `http://localhost:3333/api/1.0.0/user/${userId}/photo`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'image/png',
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
        body: blob,
      },
    )
      .then(async (response) => {
        if (response.status === 200) {
          navigation.navigate('EditAccount');
        } else if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          navigation.navigate('Login');
        } else if (response.status === 403) throw 'You cannot change this photo!';
        else throw 'Something went wrong while retrieving your data';
      })
      .catch((thisError) => {
        handleError(thisError);
      });
  }

  async function takePhoto() {
    if (camera) {
      const options = { quality: 0.5, base64: true, onPictureSaved: (data) => sendToServer(data) };
      await camera.takePictureAsync(options);
    }
  }

  const handleError = (thisError) => {
    setError(thisError);
  };

  const handleCameraToggle = () => {
    toggleCameraType();
  };

  const handleTakePhoto = () => {
    takePhoto();
  };

  if (!permission || !permission.status === 'granted') {
    return (
      <Text>No access to camera</Text>
    );
  }
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={(ref) => setCamera(ref)}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCameraToggle}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </Camera>
      <>
        {
          error
          && (
          <View style={GlobalStyle.errorBox}>
            <Icon name="alert-box-outline" size={20} color="red" style={GlobalStyle.errorIcon} />
            <Text style={GlobalStyle.errorText}>{error}</Text>
          </View>
          )
        }
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    padding: 5,
    margin: 5,
    backgroundColor: 'steelblue',
  },
  button: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ddd',
  },
});
