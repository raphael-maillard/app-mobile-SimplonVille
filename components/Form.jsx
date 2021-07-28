import React, { useState, useEffect } from 'react'
import { StyleSheet, View, TextInput, Button, TouchableOpacity, Text } from 'react-native'
import { Camera } from 'expo-camera'
import { Picker } from '@react-native-picker/picker'

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

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);


    // if (hasPermission === null) {
    //     return <View />;
    // }
    // if (hasPermission === false) {
    //     return <Text>No access to camera</Text>;
    // }

    const submit = () => {
        if (selectedLanguage != null){console.warn(data)} else window.alert("Choissez un incident ! ")
    }

    return (
        <View>
            <Picker
                onValueChange={setSelectedLanguage}
                value={selectedLanguage}
                style={{ borderWidth: 2, borderLeftColor: 'skyblue', margin: 20 }}
            >               
                <Picker.Item label="Choissez un incident" />
                <Picker.Item label="Java" value="Java" />
                <Picker.Item label="JavaScript" value="JavaScript" />
                <Picker.Item label="React Native" value="React Native" />
            </Picker>

            <TextInput
                placeholder="Email"
                onChangeText={setEmail} value={email}
                style={{ borderWidth: 2, borderLeftColor: 'skyblue', margin: 20 }}
                keyboardType="email-address"
            />

            <TextInput
                placeholder="Nom"
                onChangeText={setName} value={name}
                style={{ borderWidth: 2, borderLeftColor: 'skyblue', margin: 20 }}
            />

            <TextInput
                placeholder="Prénom"
                onChangeText={setFirstName} value={firstName}
                style={{ borderWidth: 2, borderLeftColor: 'skyblue', margin: 20 }}
            />

            <TextInput
                placeholder="Numéro de téléphone"
                onChangeText={SetPhoneNumber} value = {phoneNumber}
                style={{ borderWidth: 2, borderLeftColor: 'skyblue', margin: 20 }}
                keyboardType="phone-pad" r
            />

            <TextInput
                placeholder="Description de l'incident"
                multiline={true}
                numberOfLines={4}
                maxLenght={40}
                onChangeText={SetDesciption} value={incident}
                style={{ borderWidth: 2, borderLeftColor: 'skyblue', margin: 20 }}
            />

            <Camera style={styles.camera}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            );
                        }}>
                        <Text style={styles.text}> Flip </Text>
                    </TouchableOpacity>
                </View>
            </Camera>
            
            <Button title="submit" onPress={() => { submit() }} />
        </View >
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
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
});

export default formulaire