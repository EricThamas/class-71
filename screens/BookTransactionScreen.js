import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert
} from 'react-native';
//import { TouchableOpacity } from 'react-native-gesture-handler';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';

import firebase from "firebase";
import db from "../config.js";
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';
export default class TransactionScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      hasCameraPermission: null,
      scanned: false,
      //scannedData: '',
      buttonState: 'normal',
      scanbookid: '',
      scanstudentid: '',
      TransactionMessage:'',
    };
  }

  getCameraPermission = async (id) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      // status === "granted" true when user has granted permission
      // status === "granted" false when user hasnot garnted permission
      hasCameraPermission: status === 'granted',
      buttonState: id,
      scanned: false,
      //scannedData: '',
    });
    console.log(this.state.hasCameraPermission);
    console.log(this.state.buttonState);
    console.log(this.state.scanned);
    console.log(this.state.scanbookId);
    console.log(this.state.scanstudentid);
  };

  handleBarcode = async ({ type, data }) => {
    const { buttonState } = this.state;
    if (buttonState === 'bookid') {
      this.setState({
        scanned: true,
        scanbookid: data,
        buttonState: 'normal',
      });
    } else if (buttonState === 'studentid') {
      this.setState({
        scanned: true,
        scanbookid: data,
        buttonState: 'normal',
      });
    }
  };
  initiatebookissue=async()=>{
//addTransaction
db.collectio("Transaction").add({
  studentID:this.state.scanstudentid,
  bookid:this.state.scanbookid,
  date:firebase.firestore.Timestamp.now().toDate(),
  TransactionType:"issued"
})
//if the book is issued change book status
db.collection("Books").doc(this.state.scanbookid).update({BookAvailbality:false})
//cahnge the number of book issued in student collection
db.collection("student").doc(this.state.scanstudentid).update({
  numberOfBookIssued:firebase.firestore.FieldValue(1)
 
})
Alert.alert("BookIsIssued")
this.setState({
  scanbookId:'',
  scanstudentid:'',
})
  }
  initiatebookreturn=async()=>{
    //addTransaction
db.collectio("Transaction").add({
  studentID:this.state.scanstudentid,
  bookid:this.state.scanbookid,
  date:firebase.firestore.Timestamp.now().toDate(),
  TransactionType:"return"
})
//if the book is issued change book status
db.collection("Books").doc(this.state.scanbookid).update({BookAvailbality:true})
//cahnge the number of book issued in student collection
db.collection("student").doc(this.state.scanstudentid).update({
  numberOfBookIssued:firebase.firestore.FieldValue(-1)
 
})
Alert.alert("BookIsReturned")
this.setState({
  scanbookId:'',
  scanstudentid:'',
})
  }
  handleTransaction=async ()=>{
    var TransactionMessage
    db.collection("Books").doc(this.state.scanbookid).get().then((doc)=>{
      //console.log(doc.data())
      var book=doc.data()
      if(book.BookAvailbality){
        this.initiatebookissue();
        TransactionMessage = "book issued"


      }
      else{
        this.initiatebookreturn()
        TransactionMessage="book return"

      }
    })
    this.setState({
      TransactionMessage:TransactionMessage
    })


  }
  render() {
    const hasCameraPermission = this.state.hasCameraPermission;
    const buttonState = this.state.buttonState;
    const scannedData = this.state.scannedData;
    const scanned = this.state.scanned;

    if (buttonState !== 'normal' && hasCameraPermission) {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? 'no data yet' : this.handleBarcode}
          style={StyleSheet.absoluteFillObject}
        />
      );
    } else if (buttonState === 'normal') {
      return (
        <View style={styles.container}>
          <Image
            source={require('../assets/booklogo.jpg')}
            style={{ width: 200, height: 200 }}></Image>
          <Text
            style={{ textAlign: 'CENTER', fontSize: 30, fontWeight: 'bold' }}>
            Willy
          </Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="book Id"
              value={this.state.scanbookid}
              onChangeText={(text)=>{
                this.setState({
                  scanbookid:text
                })
              }}
              style={styles.textInputBox}></TextInput>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => {
                this.getCameraPermission('bookid');
              }}>
              <Text style={styles.buttonText}>scan</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="student Id"
              value={this.state.scanstudentid}
              onChangeText={(text)=>{
                this.setState({
                  scanstudentid:text
                })
              }}
              style={styles.textInputBox}></TextInput>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => {
                this.getCameraPermission('studentid');
              }}>
              <Text style={styles.buttonText}>scan</Text>
            </TouchableOpacity>

          </View>
          <TouchableOpacity style={styles.submitButton}onPress={async()=>{
            var TransactionMessage=await this.handleTransaction()
          }}>
              <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { fontSize: 15, textAlign: 'center', marginTop: 10 },
  inputBox: { flexDirection: 'row', marginTop: 10 },
  textInputBox: {
    width: 200,
    height: 40,
    borderWidth: 2,
    fontSize: 20,
    borderRightWidth: 0,
  },
  scanButton: {
    backgroundColor: 'skyblue',
    width: 50,
    borderWidth: 2,
    borderLeftWidth: 0,
  },
  submitButton:{
    backgroundColor:"blue",
    width:100,
    height:50,
  },
  submitButtonText:{
    padding:10,
    textAlign:"center",
    fontSize:20,
    fontWeight:"bold",
    color:"white",
  },

});
