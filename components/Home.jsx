import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const Home = ({ navigation }) => {
    return (
        <View style={styles.view}>
            <Text style={{
                textAlign: "center", marginTop: 10, fontWeight: "bold", fontSize: 60,
            }}>
                <Text style={styles.headerTitle}><Text style={styles.lettrine}>S</Text>implon ville</Text>
            </Text>
            <TouchableOpacity
                style={styles.btn}
                onPress={() => navigation.navigate('Form')}>
                <Text style={styles.btnStyleText}>Signaler un incident</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({

    view:{
        alignItems: "center",
    },

    lettrine: {
        color: '#F20F0F',
        fontSize: 90
    },

    headerTitle: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    btn: {
        backgroundColor: '#415A77',
        height: 80,
        marginTop: 80,
        borderRadius: 6,
        justifyContent: "center",
        alignContent: "center",
        width: 200,
    },

    btnStyleText: {
        fontSize:18,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: "center",
    },


    //     .loginForm {
    //     min- width: 150px;
    // max - width: 1200px;
    // width: 100 %;
    // margin: auto;
    // display: flex;
    // flex - direction: column;
    // justify - content: space - evenly;
    //   }

    // .formContainer{
    //     border: 1px solid #FA6666;
    //     padding: 3 %;
    //     border - radius: 20px;
    // }

    // .redButton{
    //     margin - top: 3 %;
    //     background - color: #C24444;
    //     color: #FFF;
    //     width: 15 %;
    // }

    // .alertContainer{
    //     margin - top: 2 %;
    // }

    // .toastContainer{
    //     position: absolute;
    //     top: 0;
    //     right: 2 %;
    // }

    // .form - control:focus{
    //     border: none;
    //     box - shadow: inset 0 1px 1px rgba(216, 18, 18, 0.233), 0 0 8px rgba(199, 27, 27, 0.993);
    //     outline: 0 none;
    // }





})

export default Home;