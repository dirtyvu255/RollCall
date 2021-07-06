import React from 'react'
import {Text, TextInput, View,TouchableOpacity, Image, Alert } from 'react-native'
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import EStyleSheet from 'react-native-extended-stylesheet'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import Logo from '../../images/logo.png'

export default class Login extends React.Component {

  state = { email: '', 
  password: '', 
  phone: '', 
  errorMessage: null, 
  loginByEmail: false, 
  getOTP: false, 
  confirm: {} }
  handleLogin = () => {
    const { email, password } = this.state
      auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        const {displayName} = auth().currentUser 
        const userID = auth().currentUser.uid
        this.storeUser(userID, displayName)
        if(displayName == 'Faculty')
          this.props.navigation.navigate('MenuFaculty')
        else if(displayName == 'Teacher')
          this.props.navigation.navigate('RollCallChooseClass',{userID: userID })
        else if(displayName == 'Student')
          this.props.navigation.navigate('MenuStudent',{userID: userID })
      })
      .catch(error => this.setState({ errorMessage: 'Sai Email hoặc PassWord' }))
  }
  loginPhoneNumber = async(phone) => {
    const sub = await auth().signInWithPhoneNumber(phone)
    this.setState({confirm: sub})
  }
  confirmCode = async(code) =>{
    const response = await this.state.confirm.confirm(code)
    if(response){
      this.storeUser(response.user.uid)
      this.props.navigation.navigate('MenuStudent',{userID: response.user.uid })
    }
  }
  storeUser = async(userID,role) => {
    try{
      await AsyncStorage.setItem('userID', userID)
      if(role){
        await AsyncStorage.setItem('role', role)
      }
    } catch (e){
      console.log(e)
    }
  }
  toggleTypeLogin(){
    this.setState({loginByEmail: !this.state.loginByEmail})
  }
  toggleGetOTP(){
    let phone = this.state.phone
    if(phone.length==10 && phone.substring(0,1)==0){
      let country = '+84'
      let temp = country + this.state.phone.substring(1,10)
      this.loginPhoneNumber(temp)
      this.setState({getOTP: !this.state.getOTP})  
    }
  }
  render() {
    return (
      <View style={styles.mainContainer}>
          <View style={{alignItems: 'center', marginTop: 30}}>
            <Image source={Logo} style={styles.logoBLock}/>
            <Text style={styles.textWelcome}>Chào mừng đến với RollCall!</Text>
          </View>
          {this.state.loginByEmail ? (
            <View>
              <View style={styles.container}>
                <View style={{marginTop: 5, marginBottom: 20}}>
                  <TextInput
                    style={styles.textInput}
                    placeholderTextColor='#000'
                    autoCapitalize="none"
                    placeholder="Nhập email"
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                  />
                </View>
                <View style={{marginBottom: 5}}>
                  <TextInput
                    secureTextEntry
                    style={styles.textInput}
                    placeholderTextColor='#000'
                    autoCapitalize="none"
                    placeholder="Nhập mật khẩu"
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                  />
                </View>
                {this.state.errorMessage &&
                  Alert.alert("Thông báo", this.state.errorMessage)
                  }
              </View>
              <TouchableOpacity onPress={() => this.toggleTypeLogin()}>
                <Text style={styles.forgotText}>Đăng nhập bằng số điện thoại</Text>
              </TouchableOpacity>          
              <TouchableOpacity onPress={this.handleLogin} style={styles.confirmBlock}> 
                    <Text style={styles.confirmText}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          ):(
            <View>
              <View style={styles.container}>
                <View style={{marginTop: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <TextInput
                    style={[styles.textInput, {width: 200, marginRight:25}]}
                    placeholderTextColor='#000'
                    autoCapitalize="none"
                    placeholder="Nhập số điện thoại"
                    keyboardType='phone-pad'
                    maxLength={10}
                    onChangeText={phone => this.setState({ phone })}
                    value={this.state.phone}
                  />
                  <TouchableOpacity onPress={() => this.toggleGetOTP()} style={{backgroundColor: '#67e2d9',justifyContent: 'center', alignItems:'flex-end', paddingHorizontal: 13,borderRadius: 10, height: 35, marginTop: 5}}> 
                    <Text style={{fontSize: 13, fontWeight: '600'}}>Get OTP</Text>
                  </TouchableOpacity>
                </View>
                {this.state.getOTP? (
                  <OTPInputView
                      style={{width: '100%', height: 40, marginTop: 20}}
                      pinCount={6}
                      code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                      onCodeChanged = {code => { this.setState({code})}}
                      autoFocusOnLoad
                      codeInputFieldStyle={styles.borderStyleBase}
                      codeInputHighlightStyle={styles.borderStyleHighLighted}
                      onCodeFilled = {(code => {
                        this.confirmCode(code)
                      })}
                  />
                 ): null}
                {this.state.errorMessage &&
                  Alert.alert("Thông báo", this.state.errorMessage)
                  }
              </View>
              <TouchableOpacity onPress={() => this.toggleTypeLogin()}>
                <Text style={styles.forgotText}>Đăng nhập bằng email</Text>
              </TouchableOpacity>          
            </View>
          )}
        </View>
    )
  }
}
const styles = EStyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    marginTop: '-10rem'
  },
  container: {
    marginHorizontal: '3rem',
    borderWidth: 0.5,
    borderRadius: 10,
    padding: '2.5rem',
    paddingTop: '1rem',
    paddingBottom: '3rem',
  },
  logoBLock: {
    marginBottom: '5rem',
    height: '24rem',
    width: '28rem',
  },
  textWelcome: {
    marginTop: '-4rem', 
    fontWeight: '600', 
    fontSize: 20, 
    marginBottom: '2.5rem'
  },
  textInput: {
    height: '4.5rem',
    borderColor: 'gray',
    borderBottomWidth: 1.5,
  },
  loginBlock: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotText: {
    marginVertical: '2rem',
    color: '#67e2d9', 
    fontWeight: '600', 
    fontSize: 17, 
    textAlign: 'center'
  },
  confirmBlock: {
    backgroundColor: '#67e2d9',
    height: '5rem',
    width: '18rem',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '5rem',
    borderRadius: '10rem',
    alignSelf: 'center'
  },
  confirmText: {
    fontWeight: 'bold',
    fontSize: 20
  },
  borderStyleBase: {
    width: '4rem',
    height: '4rem',
    color: 'black'
  },
  borderStyleHighLighted: {
    borderColor: "#53DAC6",
  },
})