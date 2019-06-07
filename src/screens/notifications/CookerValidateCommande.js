import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  PanResponder,
  ActivityIndicator,
  Linking
} from "react-native";
import { Icon, Toast } from "native-base";
import Mapbox from "@mapbox/react-native-mapbox-gl";
import { color } from "../home/MapComponents/MyData/Mydata";
import firebase from "react-native-firebase";
Mapbox.setAccessToken(
  "pk.eyJ1IjoiYWxpbm8xOTk4IiwiYSI6ImNqcHdvdG13ZjBkb280OHIxZTV6dDVvOWUifQ.IqCLhCar6dlPsSXwPQbE3A"
);

class CookerValidateCommande extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingButton: false,
      disabled: false,
      key:null,
      itemSelected: null,
      showInformations: false,
      showValidateReject: false,
      topPosition: new Animated.Value(0),
      loading: true,
      normalDateAdded: null,
      normalDatePlaced:null,
      buyer: null
    };
    this.customerPosition = [-6.8438266, 34.0097651];
    this.dimension = Dimensions.get("window");
    this.raisonIndispo = [
      "Indiponibilité du repas",
      "Indiponibilité du cuisinier",
      "Autres"
    ];
    this.comIcon = require('../home/MapComponents/Images/iconfinder_234-man-raising-hand-1_3099355.png');
    this.data=null;
    this.user=null;
  }

  animation = () => {
    animeFooter = Animated.timing(this.state.topPosition, {
      toValue: 0,
      duration: 200,
      easing: Easing.linear
    }).start();
  };

  custumerLocation = () => {
    return (
      <Mapbox.PointAnnotation
        key={"customer location"}
        id={"customer location"}
        coordinate={[this.data.buyer.localisation.latitude,this.data.buyer.localisation.longitude]}
      >
        <View>
          {/* <Icon
              name="location-pin"
              type="Entypo"
              style={{ color: color.orange, fontSize: 40 }}
            /> */}
          <Image
            style={styles.cmLocationImageStyle}
            resizeMode={"cover"}
            source={this.comIcon}
          />
        </View>
        <Mapbox.Callout
          title={"Votre client"}
          contentStyle={styles.calloutContentStyle}
          textStyle={styles.calloutTextStyle}
        />
      </Mapbox.PointAnnotation>
    );
  };

  MapViewRender = () => {
    return (
      <Mapbox.MapView
        styleURL={Mapbox.StyleURL.Street}
        minZoomLevel={zomLevel}
        zoomLevel={zomLevel}
        maxZoomLevel={zomLevel}
        centerCoordinate={[this.data.buyer.localisation.latitude,this.data.buyer.localisation.longitude]}
        style={styles.mapViewContainer}
        rotateEnabled={false}
        scrollEnabled={false}
        logoEnabled={false}
        attributionEnabled={false}
      >
        {this.custumerLocation()}
      </Mapbox.MapView>
    );
  };

  totalVenteRender = () => {
    return (
      <TouchableOpacity
        style={styles.tvContenair}
        activeOpacity={0.9}
        onPress={() => {
          this.setState(prevState => ({
            showInformations: !prevState.showInformations
          }));
        }}
      >
        <Text style={styles.tvTotalPrice}>Prix total</Text>
        <View style={styles.tvDirectionRow}>
          <Text style={styles.tvMad}> MAD </Text>
          <Text style={styles.tvPrice}>
            {this.data.price * this.data.quantite}
          </Text>

          {this.state.showInformations ? (
            <Icon name="chevron-up" type="EvilIcons" style={styles.tvIcon} />
          ) : (
            <Icon name="chevron-down" type="EvilIcons" style={styles.tvIcon} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  infosVenteRender = () => {
    if (this.state.showInformations) {
      return (
        <View style={styles.ivContenair}>
          <Text style={styles.ivInfoSup}>Informations suplémentaires</Text>
          <View style={styles.ivInfoIntContainer}>
            <Text style={styles.ivText}>Repas commandé</Text>
            <Text style={styles.ivText}>{this.data.name}</Text>
          </View>
          <View style={styles.ivInfoIntContainer}>
            <Text style={styles.ivText}>Date de mise en ligne   </Text>
            <Text style={styles.ivText}>{this.state.normalDateAdded.date} à {this.state.normalDateAdded.hour}</Text>
          </View>
          <View style={styles.ivInfoIntContainer}>
            <Text style={styles.ivText}>Date de commande   </Text>
            <Text style={styles.ivText}>{this.state.normalDatePlaced.date} à {this.state.normalDatePlaced.hour}</Text>
          </View>
          <View style={styles.ivInfoIntContainer}>
            <Text style={styles.ivText}>Prix unitaire   </Text>
            <Text style={styles.ivText}>{this.data.price}</Text>
          </View>
          <View style={styles.ivInfoIntContainer}>
            <Text style={styles.ivText}>Quantité   </Text>
            <Text style={styles.ivText}>{this.data.quantite}</Text>
          </View>
          <View style={styles.ivContTotal}>
            <Text style={styles.ivTotal}>Total</Text>
            <Text style={styles.ivTotal}>
              {this.data.price * this.data.quantite}
            </Text>
          </View>
        </View>
      );
    }
  };

  modePayement = () => {
    return (
      <View style={styles.mpConatiner}>
        <Icon
          name="cash-multiple"
          type="MaterialCommunityIcons"
          style={styles.mpIcon}
        />
        <Text style={styles.mpText}>Paiement cash</Text>
      </View>
    );
  };

  infoAcheteurRender = () => {
    return (
      <View style={styles.iaContainair}>
        <View style={styles.iaView2}>
          <View style={styles.iaViewIcon1}>
            <Icon
              name="user-circle"
              type="FontAwesome"
              style={styles.iaIconUser}
            />
          </View>
          <View style={{ paddingLeft: 10 }}>
            <Text style={styles.iaUserName}>{this.data.name}</Text>
            <Text>Client   </Text>
          </View>
        </View>
        <View style={styles.telephoneView}>
          <Icon
            name="phone"
            type="SimpleLineIcons"
            style={styles.iconTelephoneUser}
          />
        </View>
      </View>
    );
  };

  boutonValidateAndAnulate = () => {
    if(this.state.loadingButton){
      return(
        <View style={styles.bvContainer}>
          <ActivityIndicator color='white' size='large'/>
        </View>
      )
    }
    return (
      <View style={styles.bvContainer}>
        <TouchableOpacity onPress={()=>{this.setState({disabled: true});this.ValidateOrder(this.state.key)}} activeOpacity={0.9} style={styles.bvCommandeBouton}>
          <Text style={styles.bvCommandeBoutonText} >VALIDER LA COMMANDE</Text>
        </TouchableOpacity>
        <View style={styles.bvRjectContainer}>
          <Text
            style={{ color: "red" }}
            onPress={() => this.setState({ showValidateReject: true })}
          >
            REJETER LA COMMANDE
          </Text>
        </View>
      </View>
    );
  };

  confirmationAnnulation = () => {
    if (this.state.showValidateReject) {
      return (
        <Animated.View
          style={[
            styles.confirmCancelCOntainer,
            { bottom: this.state.topPosition }
          ]}
          {...this.panResponder.panHandlers}
        >
          <Text style={styles.ccRaison}>
            Indiquer la raison de l'annulation
          </Text>
          <View>
            {this.raisonIndispo.map(itemSelected => {
              return (
                <View key={itemSelected} style={styles.ccRaisonDetail}>
                  {this.state.itemSelected === itemSelected ? (
                    <Text
                      onPress={() => {
                        this.setState({ itemSelected });
                      }}
                      style={{ color: "red", fontWeight: "bold" }}
                    >
                      {itemSelected}
                    </Text>
                  ) : (
                    <Text
                      onPress={() => {
                        this.setState({ itemSelected });
                      }}
                      style={{ color: "black", fontWeight: "bold" }}
                    >
                      {itemSelected}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
          <View style={styles.ccViewConfirm}>
            <Text style={{ fontSize: 17 }} onPress={()=>{this.rejectOrder(this.state.key, this.state.itemSelected)}}>Terminé</Text>
          </View>
        </Animated.View>
      );
    }
  };
  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (Math.abs(gestureState.dy) > 5) return true;
        else return false;
      },
      // onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onPanResponderTerminationRequest: () => true,

      onPanResponderMove: (evt, gestureState) => {
        let touches = evt.nativeEvent.touches;
        if (gestureState.dy > 0 && touches.length == 1) {
          this.setState({ topPosition: new Animated.Value(-gestureState.dy) });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (this.state.topPosition._value >= -100) {
          this.animation();
        } else {
          this.setState({
            showValidateReject: false,
            topPosition: new Animated.Value(0),
            itemSelected: null
          });
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {},
      onShouldBlockNativeReponser: (evt, gestureState) => false
    });
  }

  convertToDate = async dateObject => {
    const d = await dateObject.getDate();
    const m = (await dateObject.getMonth()) + 1;
    const y = await dateObject.getFullYear();
    const h = await dateObject.getHours();
    const min = await dateObject.getMinutes();
    const date = (await d) + "/" + m + "/" + y;
    const hour = (await h) + ":" + min;
    const normalDate=await {date, hour};
    return normalDate;
  };

  getUsers=async(id)=>{
    const ref = await firebase.firestore().collection('Users').doc(id);
    await ref.get().then(async doc=>{
      await console.log(doc);
      await this.setState({buyer: doc.data()});
    })
    this.user=firebase.auth().currentUser;
    console.log(this.user);
    console.log(this.state.buyer);
  }


  getData=async(key)=>{
    const ref=await firebase.firestore().collection('Orders').doc(key);
    await ref.get().then(async doc=>{
      this.data=await doc.data();
      await this.getUsers(this.data.buyer.uid);
      this.state.key= await key;
      this.state.normalDateAdded= await this.convertToDate(this.data.dateAdded.toDate());
      this.state.normalDatePlaced=await this.convertToDate(this.data.datePlaced.toDate())
    });
  }

  sendNotification=async(validation)=>{
    const ref=await firebase.firestore().collection('Notifications');
    await ref.add({
      orderKey: this.state.key,
        recipient:{
            id: this.state.buyer.uid,
            body: validation? 'Votre commande de '+this.data.quantite+' de '+this.data.name+' à été validée, entrez en contact avec le cuisinier': 'Votre commande de '+this.data.quantite+' de '+this.data.name+' à été anulée pour cette raison: '+this.state.itemSelected ,
            title: validation? 'Votre commande a été validée':'Votre commande a été annulée' ,
            isOpened:false,
            token: this.state.buyer.pushToken
        },
        pictureURL:this.user.photoURL,
        date: firebase.firestore.Timestamp.now(),
        phoneNumber: this.user.phoneNumber
    })
  };

  ValidateOrder=async(key)=>{
    await this.setState({loadingButton:true})
    const ref = await firebase.firestore().collection('Orders').doc(key);
    await ref.set({isValidated:true, isRejected:false},{merge:true}).then(async succes=>{
      await this.sendNotification(true);
      await this.setState({loadingButton:false});
      await Toast.show({
        text: "Félicitations pour votre nouvelle vente!",
        buttonText: "Okay",
        duration: 3000,
        type: "success"
      })
    }
    )
    await this.props.navigation.goBack();
  }
  rejectOrder=async(key, reason)=>{
    await this.setState({loadingButton:true})
    const ref = await firebase.firestore().collection('Orders').doc(key);
    await ref.set({isValidated:false, isRejected:true, Reject:reason},{merge:true}).then(async success=>{
      await this.sendNotification(false);
      await this.setState({loadingButton:false});
      await Toast.show({
        text: "Vente annulée",
        buttonText: "Okay",
        duration: 3000,
        type:"warning"
      })
    });
    await this.props.navigation.goBack();
    
  }

  componentDidMount=async() =>{
    const { navigation } = await this.props;
    const key = await navigation.getParam("dataCom");
    await this.getData(key);
    await this.setState({loading:false});
  }
  render() {
    console.log("rendering");
    console.log(this.data)
    if (this.state.loading == true) {
      return (
        <View style={{ flex: 1 }}>
          <ActivityIndicator size="large" color="#F1592A" />
        </View>
      )}
      
    return (
      <View style={{ flex: 1 }}>
        { (
          <ScrollView style={styles.container}>
            {/* {this.props.children} */}
            {this.MapViewRender()}
            {this.totalVenteRender()}
            {this.infosVenteRender()}
            {this.modePayement()}
            {this.infoAcheteurRender()}
            {this.boutonValidateAndAnulate()}
          </ScrollView>
        )}

        {this.state.showValidateReject && (
          <View style={styles.cacheNoirView} {...this.panResponder.panHandlers}>
            <TouchableOpacity
              style={{
                flex: 1
              }}
              activeOpacity={0.9}
              onPress={() => {
                this.setState({ showValidateReject: false });
              }}
            />
          </View>
        )}
        <View>{this.confirmationAnnulation()}</View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ecf0f1"
  },
  cmLocationImageStyle: { width: 30, height: 30 },
  calloutContentStyle: {
    height: 30,
    width: 150,
    borderRadius: 7,
    justifyContent: "center"
  },
  calloutTextStyle: {
    fontSize: 14,
    fontWeight: "bold"
  },
  mapViewContainer: {
    height: 200,
    margin: 10,
    overflow: "hidden",
    borderRadius: 15
  },
  tvContenair: {
    height: 65,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15
  },
  tvTotalPrice: {
    fontSize: 25,
    fontWeight: "200",
    color: "black"
  },
  tvDirectionRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  tvMad: { fontSize: 20, color: "#a4b0be" },
  tvPrice: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black"
  },
  tvIcon: { color: "#a4b0be", fontSize: 25 },
  ivContenair: {
    backgroundColor: "#dfe4ea",
    borderTopColor: "#a4b0be",
    borderTopWidth: 1
  },
  ivInfoSup: {
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
    alignSelf: "center",
    padding: 10
  },
  ivInfoIntContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    height: 30
  },
  ivContTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopColor: "#a4b0be",
    borderTopWidth: 1,
    paddingLeft: 15,
    paddingRight: 15,
    height: 36
  },
  ivText: { color: "black" },
  ivTotal: { color: "black", fontWeight: "bold" },
  mpConatiner: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    borderTopColor: "#a4b0be",
    borderTopWidth: 1
  },
  mpIcon: { color: "#a4b0be", fontSize: 30 },
  mpText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#a4b0be",
    paddingLeft: 10
  },
  iaContainair: {
    height: 120,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 15,
    paddingRight: 15,
    borderTopColor: "#a4b0be",
    borderTopWidth: 1
  },
  iaView2: {
    flexDirection: "row",
    alignItems: "center"
  },
  iaViewIcon1: { height: 60, width: 60, borderRadius: 30 },
  iaIconUser: { color: "black", fontSize: 60 },
  iaUserName: { color: "black", fontWeight: "bold" },
  telephoneView: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "#2ed573",
    justifyContent: "center",
    alignItems: "center"
  },
  iconTelephoneUser: { color: "white", fontSize: 25 },
  bvContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  bvCommandeBouton: {
    backgroundColor: color.orange,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    height: 60,
    width: 330
  },
  bvCommandeBoutonText: { fontSize: 20, color: "white" },
  bvRjectContainer: {
    height: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  confirmCancelCOntainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 1
  },
  ccRaison: {
    fontSize: 17,
    alignSelf: "center",
    padding: 15,
    fontWeight: "bold"
  },
  ccRaisonDetail: {
    paddingLeft: 15,
    height: 50,
    justifyContent: "center",
    borderTopColor: "#a4b0be",
    borderTopWidth: 1
  },
  ccViewConfirm: {
    borderTopColor: "#a4b0be",
    borderTopWidth: 1,
    height: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  cacheNoirView: {
    backgroundColor: "black",
    opacity: 0.6,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
});

const zomLevel = 10;

export default CookerValidateCommande;
