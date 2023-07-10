import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Mask from '../components/Mask';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { NavigationHelpersContext, useIsFocused } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';

export default CameraScreen = ({ navigation }) => {
  const [faces, setFaces] = useState([]);
  const [type, setType] = useState(CameraType.front);
  const [selectedImage, setSelectedImage] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused) {
      closeCamera();
    }
  }, [isFocused]);

  const [capturedImageUri, setCapturedImageUri] = useState(null);
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const cameraRef = useRef(null);
  if (!permission) {
    // Camera permissions are still loading
    return <View style={{ backgroundColor: '#D39A2C' }}></View>;
  }
  if (!permission.granted) {
    // Camera permissions are not granted yet
    return <View><Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
      <Button onPress={requestPermission} title="grant permission" /></View>;
  }

  function toggleCameraType() {
    setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  const handleFacesDetected = ({ faces }) => {
    console.log(faces);
    setFaces(faces);
  };

  const mountCameraError = (error) => {
    console.log('Camera mount error:', error);
    // Handle the error condition, e.g., show an error message to the user
  };

  const handleImageSelection = (imageUri) => {
    setSelectedImage(imageUri);
  };

  const closeCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.pausePreview();
    }
  };

  const handleCaptureImage = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImageUri(photo.uri);
        setShowDownloadButton(true);
        setShowCloseButton(true);
        closeCamera();
      } catch (error) {
        console.log('Error capturing image:', error);
      }
    }
  };

  const handleDownloadImage = async () => {
    if (capturedImageUri) {
      try {
        const fileName = 'captured_image.jpg';
        const destinationUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.copyAsync({ from: capturedImageUri, to: destinationUri });
        console.log('Image saved:', destinationUri);
      } catch (error) {
        console.log('Error saving image:', error);
      }
    }
  };

  const handleClose = () => {
    setShowDownloadButton(false);
    setShowCloseButton(false);
    setCapturedImageUri(null);
    if (cameraRef.current) {
      cameraRef.current.resumePreview();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraView}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={type}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
            runClassifications: FaceDetector.FaceDetectorClassifications.none,
            tracking: true,
          }}
          onMountError={mountCameraError}
          onFacesDetected={handleFacesDetected}
        >
          <TouchableOpacity style={styles.closeCamera} onPress={closeCamera}>
            <Ionicons name="close" size={responsiveWidth(10)} color="white" />
          </TouchableOpacity>
          {faces.length > 0 &&
            faces.map((face) => <Mask key={face.faceID} face={face} selectedImage={selectedImage} />)}
        </Camera>
        {capturedImageUri && (
          <View style={styles.capturedImageContainer}>
            <Image source={{ uri: capturedImageUri }} style={styles.capturedImage} />
          </View>
        )}
        {showDownloadButton && (
          <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadImage}>
            <MaterialCommunityIcons name="download" size={responsiveWidth(8)} color="white" />
          </TouchableOpacity>
        )}
        {showCloseButton && (
          <TouchableOpacity style={styles.close} onPress={handleClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.buttonflip} onPress={toggleCameraType}>
          <MaterialCommunityIcons
            name="camera-flip-outline"
            size={responsiveWidth(10)}
            color="white"
          />
        </TouchableOpacity>
        <View style={styles.scrollviewContainer}>
          <ScrollView horizontal contentContainerStyle={styles.filtersContainer} showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => handleImageSelection(require('../assets/images/hair6.png'))}
            >
              <Image source={require('../assets/images/hair6.png')} style={styles.filterImage} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => handleImageSelection(require('../assets/images/hair7.png'))}
            >
              <Image source={require('../assets/images/hair7.png')} style={styles.filterImage} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => handleImageSelection(require('../assets/images/hair8.png'))}
            >
              <Image source={require('../assets/images/hair8.png')} style={styles.filterImage} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => handleImageSelection(require('../assets/images/hair9.png'))}
            >
              <Image source={require('../assets/images/hair9.png')} style={styles.filterImage} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => handleImageSelection(require('../assets/images/hair2.png'))}
            >
              <Image source={require('../assets/images/hair2.png')} style={styles.filterImage} />
            </TouchableOpacity>
          </ScrollView>
        </View>
        <TouchableOpacity style={styles.radioButtonContainer} onPress={handleCaptureImage}>
          <Ionicons name="radio-button-on" size={responsiveWidth(26)} color='white' />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: 'black',
  },
  cameraView: {
    //flex: 1,
    height: "85%",
    width: "100%",
    borderRadius: responsiveWidth(6.65),
    overflow: 'hidden',
  },
  camera: {
    //flex: 1,
    height: "100%",
    width: "100%",
  },
  closeCamera: {
    position: 'absolute',
    top: responsiveHeight(2),
    right: responsiveWidth(2.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadButton: {
    position: 'absolute',
    bottom: responsiveHeight(2),
    left: responsiveWidth(2.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  close: {
    position: 'absolute',
    backgroundColor: '#151515',
    height: responsiveHeight(4),
    bottom: responsiveHeight(2),
    left: responsiveWidth(12.5),
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: responsiveWidth(5),
  },
  closeText: {
    fontSize: responsiveFontSize(2),
    color: 'white',
  },
  bottomContainer: {
    //flex: 0.15,
    height: "15%",
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    justifyContent: 'center',
    borderRadius: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonflip: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: responsiveWidth(20),
    width: responsiveWidth(10),
    aspectRatio: 1,
  },
  scrollviewContainer: {
    marginStart: responsiveWidth(60),
    //paddingStart:responsiveWidth(30),
    zIndex: 1,
    //backgroundColor: 'red',
  },
  filtersContainer: {
    alignItems: 'center',
  },
  filterButton: {
    marginHorizontal: responsiveWidth(2),
    borderRadius: responsiveWidth(10),
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(9),
    width: responsiveWidth(18),
    borderWidth: responsiveWidth(1.25),
    borderColor: 'white',
    zIndex: 1,
  },
  filterImage: {
    width: 40,
    height: 40,
  },
  radioButtonContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsiveWidth(2),
    zIndex: 0,
  },
});