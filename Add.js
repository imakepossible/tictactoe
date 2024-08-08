import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';
import { RNCamera } from 'react-native-camera'; // Import RNCamera from 'react-native-camera'

import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import SplashScreen from './Splash';

export default function QRCodeReader() {
  const navigate = useNavigation();
  const [HasPermission, setHasPermission] = useState();
  const [seriesNum, setseriesNum] = useState('');
  const [msg, setMsg] = useState(true);
  const [loading,setLoading]=useState(false)

  useEffect(() => {
    (async () => {
      const { status } = await RNCamera.requestPermissions();
      if (status === 'granted') {
      setHasPermission(status === 'granted');
    }})();
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      state.isConnected ? null : Alert.alert("Please Check Your Internet Connection !");
      setMsg(state.isConnected);
    });
    unsubscribe();
  }, []);

  if (HasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (HasPermission === false) {
    return <Text>No access to camera.</Text>;
  }

  const handelSubmit = async () => {
    if (!msg) {
      Alert.alert("Please Check Your Internet Connection !");
      return false;
    }
    if (!seriesNum) {
      Alert.alert("Fill The Book Series Number");
      return false;
    }
    let existingData = await AsyncStorage.getItem('books');
    existingData = existingData ? JSON.parse(existingData) : { url: [], img: [], id: [] };

    const idExists = existingData.id.some((id) => id === seriesNum);
console.log(idExists)
    if (idExists) {
      console.log(`ID ${seriesNum} exists in AsyncStorage`);

      Alert.alert('10Pointer', 'This Book Already Exist');
      navigate.navigate("Add")
      return false;
    }

    setLoading(true)
    let res = await axios.get(`https://vardhmandigibank.com/app/getimage.php?id=${seriesNum}`);
  setseriesNum('')
    if (res.data == "-1;-1") {
      Alert.alert("Enter Valid Book Series Number");
      setLoading(false)
      return false;
    } 
    let a = res.data.split(";");

    let data = {
      img: a[0],
      code: a[1],
      id: a[2],
    };

    navigate.navigate("code", { data });
    setLoading(false)
  };
  if(loading){
    return <SplashScreen />
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => {
        if (!msg) {
          Alert.alert("Please Check Your Internet Connection !");
          return false;
        }
        setLoading(true)
        navigate.navigate("scanner");
        setLoading(false)
      }} >
        <Text style={styles.txt}>Click To Scan QR Code</Text>
        <Image
          source={require('../assets/qr-code.png')} // Replace with your image source
          style={styles.image}
        />
      </TouchableOpacity>

      <Text style={styles.txt}>OR</Text>

      <View style={styles.inputContainer}>
        <TextInput
          value={seriesNum}
          onChangeText={(text) => setseriesNum(text)}
          style={styles.input}
          placeholder='Enter Your book series number'
        />
        <TouchableOpacity onPress={handelSubmit} style={styles.btn}>
          <Text style={styles.sub}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Add a background color if needed
  },
  image: {
    width: 250,
    height: 250,
    alignSelf: "center"
  },
  inputContainer: {
    alignItems: 'center',
  },
  input: {
    width: 300,
    height: 60,
    padding: 10,
    backgroundColor: 'whitesmoke',
    borderRadius: 10,
    marginVertical: 15,
  },
  btn: {
    width: 300,
    height: 45,
    padding: 10,
    backgroundColor: '#ffcc01',
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 15,
  },
  txt: {
    fontSize: 20,
    alignSelf: "center",
    marginVertical: 10,
    marginBottom: 20
  },
  sub: {
    color: 'black',
    fontSize: 19,
    fontWeight: "bold"
  },
});
