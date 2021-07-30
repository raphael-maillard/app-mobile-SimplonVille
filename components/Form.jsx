import React, { useState, useEffect } from 'react'
import { StyleSheet, View, TextInput, Button, TouchableOpacity, Text, ScrollView, ImageBackground } from 'react-native'
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera'
import { Picker } from '@react-native-picker/picker'

let camera = Camera

function formulaire() {

    const [hasPermission, setHasPermission] = useState("");
    const [type, setType] = useState(Camera.Constants.Type.back);

    const [selectedLanguage, setSelectedLanguage] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [name, setName] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [phoneNumber, SetPhoneNumber] = React.useState("");
    const [incident, SetDesciption] = React.useState("");

    var data = [selectedLanguage, email, name, firstName, phoneNumber, incident];

    if (hasPermission === null) {
        console.log('Permission granted');
        return <View />;
    }
    if (hasPermission === false) {
        console.log('Permission refused');
        return <Text>No access to camera</Text>;
    }

    const submit = () => {
        if (selectedLanguage != null) { console.warn(data) } else window.alert("Choissez un incident ! ")
    }

    // For the camera 
    const [startCamera, setStartCamera] = React.useState(false);
    const [previewVisible, setPreviewVisible] = React.useState(false);
    const [capturedImage, setCapturedImage] = React.useState(null);
    const [cameraType, setCameraType] = React.useState(Camera.Constants.Type.back);
    const [flashMode, setFlashMode] = React.useState('off')


    const __startCamera = async () => {
        const { status } = await Camera.requestPermissionsAsync()
        if (status === 'granted') {
            console.log('Permission granted');
            setStartCamera(true)
        } else {
            console.log('Permission refuse');
            Alert.alert("Accès refusé")
        };
    };

    const __takePicture = async () => {
        const photo = await camera.takePictureAsync()
        console.log(photo.uri)
        setPreviewVisible(true)
        setCapturedImage(photo)
        return photo.uri
    }

    const __savePhoto = async () => {

        const asset = await MediaLibrary.createAssetAsync(__takePicture)
        console.log("enregistrement...")
    }

    const __retakePicture = () => {
        setCapturedImage(null)
        setPreviewVisible(false)
        __startCamera()
    }

    const __handleFlashMode = () => {
        if (flashMode === 'on') {
            setFlashMode('off')
        } else if (flashMode === 'off') {
            setFlashMode('on')
        } else {
            setFlashMode('auto')
        }
    }

    const __switchCamera = () => {
        if (cameraType === 'back') {
            setCameraType('front')
        } else {
            setCameraType('back')
        }
    }

    const handleSubmit = () => {
        if (data != null) {
            alert('Votre alerte à été envoyée : ' + data)
        }
        else {
            alert('veuillez entrez des données')
        }
    };


    return (
        <ScrollView>
            <View style={styles.container}>
                <Picker
                    onValueChange={setSelectedLanguage}
                    value={selectedLanguage}
                    style={styles.picker}
                >
                    <Picker.Item label="Choissez un incident" />
                    <Picker.Item label="Java" value="Java" />
                    <Picker.Item label="JavaScript" value="JavaScript" />
                    <Picker.Item label="React Native" value="React Native" />
                </Picker>

                <TextInput
                    placeholder="Email"
                    onChangeText={setEmail} value={email}
                    style={styles.textInput}
                    keyboardType="email-address"
                />

                <TextInput
                    placeholder="Nom"
                    onChangeText={setName} value={name}
                    style={styles.textInput}
                />

                <TextInput
                    placeholder="Prénom"
                    onChangeText={setFirstName} value={firstName}
                    style={styles.textInput}
                />

                <TextInput
                    placeholder="Numéro de téléphone"
                    onChangeText={SetPhoneNumber} value={phoneNumber}
                    style={styles.textInput}
                    keyboardType="phone-pad" r
                />

                <TextInput
                    placeholder="Description de l'incident"
                    multiline={true}
                    numberOfLines={4}
                    maxLenght={40}
                    onChangeText={SetDesciption} value={incident}
                    style={styles.textInput}
                />

                {startCamera ? (
                    <View
                        style={{
                            flex: 1,
                            width: '100%'
                        }}
                    >

                        {previewVisible && capturedImage ? (
                            <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />
                        ) : (
                            <Camera
                                style={{ flex: 1, width: "100%", minHeight: 300 }}
                                ref={(r) => {
                                    camera = r
                                }}
                            >
                                <View>
                                    <TouchableOpacity onPress={__takePicture} style={styles.btnShoot}>
                                        <Text style={styles.btnStyleText}>Shoot</Text>
                                    </TouchableOpacity>
                                </View>
                            </Camera>
                        )}
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={__startCamera}
                        style={styles.btnCamera}
                    >
                        <Text
                            style={styles.btnStyleText}
                        >
                            Take picture
                        </Text>
                    </TouchableOpacity>
                )
                }

                <View style={styles.btnBottomPage}>
                    <TouchableOpacity
                        title="submit"
                        onPress={() => { submit() }}
                        style={styles.btnCamera}
                    >
                        <Text
                            style={styles.btnStyleText}
                        >
                            Test
                        </Text>
                    </TouchableOpacity>
                </View>
            </View >
        </ScrollView>
    )
};

const CameraPreview = ({ photo, retakePicture, savePhoto }) => {
    console.log('Sauvegarde en cours', photo)
    return (
        <View style={styles.camera}>
            <ImageBackground
                source={{ uri: photo && photo.uri }}
                style={{ flex: 1, width: "100%", minHeight: 300 }} >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        padding: 15,
                        justifyContent: 'flex-end'
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}
                    >

                        <TouchableOpacity onPress={retakePicture} style={styles.btnCamera}>
                            <Text style={styles.btnStyleText}>
                                Refaire la photo
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={savePhoto} style={styles.btnCamera}>
                            <Text style={styles.btnStyleText}>
                                Enregistrer la photo
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'space-around',
    },

    camera: {
        flex: 1,
    },

    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },

    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: 'black',
        height: 500,
    },

    textInput: {
        borderWidth: 2,
        borderLeftColor: 'skyblue',
        margin: 20,
    },

    picker: {
        borderWidth: 2,
        borderLeftColor: 'skyblue',
        margin: 20,
    },

    btnCamera: {
        width: 130,
        borderRadius: 4,
        backgroundColor: '#14274e',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        position: 'relative',
    },

    btnBottomPage: {
        display: 'flex',
        flexDirection: "row"

    },

    btnStyleText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center'

    },

    btnShoot: {
        width: 130,
        borderRadius: 4,
        backgroundColor: "transparent",
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
    },
});

export default formulaire