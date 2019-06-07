import React from "react";
import { Icon, List } from "native-base";
import {
  Image,
  FlatList,
  ScrollView,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
// import { dataRepasCommande } from "../home/MapComponents/MyData/Mydata";
import OneCommande from './OneCommande'
import TextButton from '../othersComponents/TextButton'
import firebase from "react-native-firebase";
class EnCoursC extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
    this.data = [];
  }

  convertToDate = async dateObject => {
    const d = await dateObject.getDate();
    const m = (await dateObject.getMonth()) + 1;
    const y = await dateObject.getFullYear();
    const h = await dateObject.getHours();
    const min = await dateObject.getMinutes();
    const date = (await d) + "/" + m + "/" + y;
    const hour = (await h) + ":" + min;
    const normalDate = await { date, hour };
    return normalDate;
  };

  parseData = async (querySnapshot) => {
    console.log(querySnapshot);
    console.log("started parsing");
    for (let i = 0; i < querySnapshot.docs.length; i++) {
      let key = await querySnapshot.docs[i].id;
      let imagePlat = null;
      await firebase.firestore().collection('PlatPost').doc(querySnapshot.docs[i].data().platKey).get().then(doc => { let __data = doc.data(); imagePlat = __data.pictures[0] })
      let normalDate = await this.convertToDate(querySnapshot.docs[i].data().datePlaced.toDate());
      await this.data.push({ ...querySnapshot.docs[i].data(), key, normalDate, imagePlat });
    };

  }

  getData = async () => {
    const user = await firebase.auth().currentUser;
    const ref = await firebase.firestore().collection('Orders').where('buyer.uid', '==', user.uid);
    await ref.get().then((async doc => { await this.parseData(doc) }));
    await this.setState({ loading: false });
  }

  componentWillMount() {
    console.log('started WillMount')
    this.getData();
  }

  render() {
    console.log('rendering');
    console.log(this.data);
    if (this.state.loading == true) {
      return (
        <View style={{ flex: 1 }}>
          <ActivityIndicator size="large" color="#F1592A" />
        </View>
      );

    }
    return (
      <View style={styles.mainContainer}>
        <ScrollView>
        <List
            dataArray={this.data}
            renderRow={item => (<TouchableOpacity
              activeOpacity={0.8}
              style={stylesA.mainContainer}
            // onPress={() => {
            //   fc(this.data);
            // }}
            >
              <View style={stylesA.containerImagePlat}>
                <Image
                  style={{ height: 60, width: 60, borderRadius: 30 }}
                  resizeMode={"cover"}
                  source={{ uri: item.imagePlat }}
                />
                <View style={stylesA.containerImageCuisto}>
                  <Image
                    style={{ height: 30, width: 30, borderRadius: 15 }}
                    resizeMode={"cover"}
                    source={{ uri: item.buyer.picture }}
                  />
                </View>
              </View>
              <View style={stylesA.containerInfo}>
                <Text style={[stylesA.mainTextStyle, { color: 'black', marginBottom: 3 }]}>
                  Vous avez effectué une commande MAD {item.price * item.quantite} de {item.name}
                </Text>
                <Text style={stylesA.mainTextStyle}>{item.normalDate.date} à {item.normalDate.hour}</Text>
              </View>
              <View style={stylesA.containerBottom}>
                <View style={stylesA.globalContainerVoir_icon}>
                  {/* <Text style={styles.voirTextStyle}>oir le post</Text> */}
                  <Icon name="eye" style={stylesA.iconStyle} type="AntDesign" />
                </View>
              </View>
            </TouchableOpacity>)}
          />
        </ScrollView>
      </View>
    )

  }
}

const stylesA = StyleSheet.create({
  mainContainer: {
    height: 90,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#bdc3c7",
    backgroundColor: "#f5f6fa",
    alignItems: "center",
    padding: 5
  },
  containerImagePlat: {
    height: 70,
    width: 70,
    justifyContent: "center",
    alignItems: "center"
  },
  containerInfo: {
    marginLeft: 10,
    flex: 5,
    justifyContent: "center"
  },
  mainTextStyle: {
    fontSize: 14,
    textAlignVertical: "center",
    color: "#bdc3c7"
  },
  containerBottom: {
    justifyContent: "center",
    alignItems: 'flex-end',
    flex: 1,
  },
  containerImageCuisto: {
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: 0
  },
  globalContainerVoir_icon: {
    borderRadius: 15,
    backgroundColor: "#2897f3",
    justifyContent: "center",
    alignItems: 'center',
    height: 30,
    width: 30,
  },
  voirTextStyle: {
    color: "white",
    fontSize: 14
  },
  iconStyle: {
    fontSize: 20,
    color: "white",
  }
});
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  Nocommande: { justifyContent: "center", alignItems: "center", flex: 1 },
  textStyle: {
    fontSize: 20,
    textAlignVertical: "center",
    textAlign: "center"
  }
});

export default EnCoursC;

//data
