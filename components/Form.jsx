import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import emailjs from 'emailjs-com';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import React, { useState } from 'react';
import { Dimensions, ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

let camera = Camera;
let photoUrl = null;
let ObjectPhoto = null;

function formulaire() {

    const [getLocation, setLocation] = useState({ longitude: 0, latitude: 0, latitudeDelta: 0, longitudeDelta: 0 })
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [problemType, setproblemType] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [getImage, setImage] = useState("");
    const [firstName, setFirstName] = useState("");
    const [phoneNumber, SetPhoneNumber] = useState("");
    const [zip, setZip] = useState("");
    const [adress, setAdress] = useState("");
    const [incident, SetDesciption] = useState("");

    var data = {
        cause: problemType,
        email: email,
        name: name,
        firstname: firstName,
        phoneNumber: phoneNumber,
        description: incident,
        location: 'https://www.google.fr/maps/place/'+getLocation.latitude+ ',' + getLocation.longitude,
        date: date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate(),
        fullDate : date,
        time: date.getHours() + ':' + date.getMinutes()+ ':' + date.getSeconds(),
        userZipcode: zip,
        userAddress: adress,
        picture: getImage,
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };


    // Activate location on click
    const __startLocalisation = async () => {

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status == "granted") {
            try {
                let location = await Location.getCurrentPositionAsync({})
                setLocation({
                    longitude: location.coords.longitude,
                    latitude: location.coords.latitude,
                    latitudeDelta: 1,
                    longitudeDelta: 1,
                });
                console.log(location)
            }
            catch (e) {
                console.log(e)
            };
        } else console.log("Fuck " + status)
    }


    // For the camera 
    const [startCamera, setStartCamera] = React.useState(false);
    const [previewVisible, setPreviewVisible] = React.useState(false);
    const [capturedImage, setCapturedImage] = React.useState(null);


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
        const options = { quality: 0.5, base64: true };
        const photo = await camera.takePictureAsync(options);
        console.log(photo.uri);
        setPreviewVisible(true);
        setCapturedImage(photo);
        photoUrl = photo.uri;
        ObjectPhoto = photo;

    };

    const __savePhoto = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        console.log(MediaLibrary.getPermissionsAsync());


        // to send the picture to cloudnary
        const source = ObjectPhoto.base64;

        let base64Img = `data:image/jpg;base64,${source}`;
        let apiUrl = 'https://api.cloudinary.com/v1_1/db27hucmm/image/upload';
        let picture = {
            file: base64Img,
            upload_preset: 'myUploadPreset',
            api_key: '785546996543439',
            timestamp: new Date(),
        };


        fetch(apiUrl, {
            body: JSON.stringify(picture),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        })
            .then(async response => {
                let data = await response.json();
                if (data.secure_url) {
                    alert('Upload successful');
                    console.log(data);
                    setImage(data.url);
                }
            })
            .catch(err => {
                alert('Cannot upload');
            });

        // Save in the mobile
        try {
            const assert = await MediaLibrary.createAssetAsync(photoUrl);
            MediaLibrary.createAlbumAsync("Expo", assert);
            ObjectPhoto = assert;
            console.log("On enregistre")
        } catch (e) {
            console.log(e)
        }

    }

    const __retakePicture = () => {
        setCapturedImage(null)
        setPreviewVisible(false)
        __startCamera()
    }

    const register = (data) => {
        try {
            fetch('http://77.141.101.84:8080/alert/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            console.log("Try good");
        } catch (error) {
            console.error(error);
        }
    
    }

    // Send the form
    const handleSubmit = async () => {
        if (data != null && problemType != null) {
            try{
            alert('Votre alerte à été envoyée !')
            //emailjs.send('service_vmjj9po', 'template_y4pfp21', data, 'user_t5vblhT1zt9eu8R2rrtac');
            const results = register(data);
            console.log(data);
            }
            catch(error){
                console.log(error);
                alert(
                    (error && error.message) ||
                    `Oups! Quelque chose s'est mal passé. Veuillez réessayer!`,
                );
            }
        }
        else {
        
            window.alert("Toutes les données ne sont pas renseignées")
        }
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Picker
                    onValueChange={setproblemType}
                    value={problemType}
                    style={styles.picker}
                >
                    <Picker.Item label="Choissez un incident" />
                    <Picker.Item label="Voirie" value="Voirie" />
                    <Picker.Item label="Stationnement" value="stationnement" />
                    <Picker.Item label="Travaux" value="travaux" />
                </Picker>

                <TextInput
                    placeholder="Email"
                    onChangeText={setEmail} value={email}
                    style={styles.textInput}
                    keyboardType="email-address"
                    rules={{ required: 'Email is required.' }}
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
                    placeholder="Adresse"
                    onChangeText={setAdress} value={adress}
                    style={styles.textInput}
                />

                <TextInput
                    placeholder="Code postal"
                    onChangeText={setZip} value={zip}
                    style={styles.textInput}
                    keyboardType="phone-pad" r
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
                {/* Camera here */}
                {startCamera ? (
                    <View
                        style={{
                            flex: 1,
                            width: '100%',
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
                                            <Text style={styles.btnStyleTextShoot}>Shoot</Text>
                                    </TouchableOpacity>
                                </View>
                            </Camera>
                        )}
                    </View>

                ) : (
                    <TouchableOpacity
                        onPress={__startCamera}
                        style={styles.btncenter}
                    >
                        <Text
                            style={styles.btnStyleText}
                        >
                            Prendre une photo de l'incident
                        </Text>
                    </TouchableOpacity>
                )
                }

                {/* Expo Location */}
                <View>
                    <TouchableOpacity
                        onPress={__startLocalisation}
                        style={styles.btncenter}>
                        <Text style={styles.btnStyleText}>Donner ma position pour l'intervention</Text>
                    </TouchableOpacity>
                </View>
                {/* Expo Maps */}

                <View style={styles.container}>
                    <MapView style={styles.map}>
                        <Marker coordinate={getLocation} title="Alerte" pinColor='#000000' />
                    </MapView>
                </View>

                <View style={{
                    flexDirection: 'row',
                }}>
                    <View>
                        <TouchableOpacity style={styles.btn} onPress={showDatepicker} title="Choisir la date">
                            <Text style={styles.btnStyleText}>Renseigner la date</Text>
                        </TouchableOpacity>

                    </View>
                    <View>
                        <TouchableOpacity style={styles.btn} onPress={showTimepicker} title="Choisir l'heure">
                            <Text style={styles.btnStyleText}>Renseigner l'heure</Text>
                        </TouchableOpacity>
                    </View>
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                        />
                    )}
                </View>

                <View style={styles.btnBottomPage}>
                    <TouchableOpacity
                        title="submit"
                        onPress={() => { handleSubmit() }}
                    >
                        <Text
                            style={styles.btnStyleTextValide}
                        >
                            Envoyer l'incident
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </ScrollView>
    )
};

const CameraPreview = ({ photo, retakePicture, savePhoto }) => {
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

                        <TouchableOpacity onPress={retakePicture} style={styles.btn}>
                            <Text style={styles.btnStyleText}>
                                Refaire la photo
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={savePhoto} style={styles.btn}>
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
        backgroundColor: "#F0EDEE",
    },

    camera: {
        flex: 1,
    },

    text: {
        fontSize: 18,
        color: 'black',
        height: 500,
        marginLeft: 5,
    },

    textInput: {
        borderWidth: 2,
        margin: 20,
        borderColor: '#C99C70',
    },

    picker: {
        marginTop: 15,
        borderWidth: 2,
        borderLeftColor: 'skyblue',
        margin: 20,
    },

    btn: {
        width: 130,
        borderRadius: 4,
        backgroundColor: '#E1CA9F',
        justifyContent: "space-between",
        alignItems: 'center',
        marginHorizontal: 5,
        height: 40,
        position: 'relative',
        marginLeft: 43,
        marginVertical: 10,
    },

    btncenter: {
        width: 130,
        borderRadius: 4,
        backgroundColor: '#E1CA9F',
        justifyContent: "space-between",
        alignItems: 'center',
        height: 40,
        position: 'relative',
        marginTop: 10,
        marginLeft: "30%",
    },

    btnBottomPage: {
        borderRadius: 4,
        backgroundColor: '#198754',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginTop: 20,
        height: 50,
    },

    btnStyleText: {
        color: '#575C60',
        fontWeight: 'bold',
        textAlign: 'center',
    },

    btnStyleTextShoot: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },

    btnStyleTextValide: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },

    btnShoot: {
        width: 130,
        borderRadius: 4,
        backgroundColor: "transparent",
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
    },

    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 300,
        marginVertical: 10,
    },
});

export default formulaire

