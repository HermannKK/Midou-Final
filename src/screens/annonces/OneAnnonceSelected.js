import React from "react";
import { Icon } from "native-base";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import SliderImage from "../othersComponents/SliderImage";
import MapPosition from "../othersComponents/MapPosition";

class OneAnnonceSelected extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }
  componentWillMount() {
    const { navigation } = this.props;
    const data = navigation.getParam("dataAnnonce");
    this.setState({ data: data });
  }
  render() {
    const data = this.state.data;
    console.log(data);
    const latitude = data.localisation.latitude;
    const longitude = data.localisation.longitude;
    const position = [latitude,longitude];
    console.log(latitude);
    console.log(longitude);
    console.log(position);
    return (
      <View style={styles.mainContainer}>
        {this.state.data != null && (
          <ScrollView style={{ flex: 1, paddingTop: 5 }}>
            <SliderImage tabI={data.pictures} height={300} />
            <View style={styles.alldetailsCon}>
              <Text style={styles.boldTextHeader}>SUMMARY</Text>
              <View style={styles.sumarycontent}>
                <View>
                  <Text style={styles.summaryTitle}>Ventes</Text>
                  <Text style={styles.summaryContentA}>
                    DH {data.price * data.orders}
                  </Text>
                </View>
                <View>
                  <Text style={styles.summaryTitle}>Commandes</Text>
                  <Text style={styles.summaryContentA}>{data.orders}</Text>
                </View>
                <View>
                  <Text style={styles.summaryTitle}>Vues</Text>
                  <Text style={styles.summaryContentB}>{data.views}</Text>
                </View>
              </View>
              <Text style={[styles.boldTextHeader, styles.borderSt]}>
                DÉTAILS
              </Text>
              <MapPosition
                position={position}
                zomLevel={10}
                height={150}
                title={"Vos repas"}
                image={data.pictures[0]}
              />
              <Text>
                ({latitude};{longitude})
              </Text>
              <Text style={[styles.mainTextStyle, { marginTop: 10 }]}>
                Date:{" "}
                <Text style={styles.boldText}>
                  {data.normalDate}
                </Text>
              </Text>
              <Text style={styles.mainTextStyle}>
                Prix:{" "}
                <Text style={styles.boldText}>
                  {"MAD "}
                  {data.price}
                  
                </Text>
              </Text>
              <Text style={styles.mainTextStyle}>
                Titre: <Text style={styles.boldText}>{data.name}</Text>
              </Text>
              <Text style={styles.mainTextStyle}>
                Description:{" "}
                <Text style={styles.boldText}>{data.description}</Text>
              </Text>
            </View>
          </ScrollView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#ecf0f1"
  },
  textStyle: {
    fontSize: 20,
    textAlignVertical: "center",
    textAlign: "center"
  },
  mainTextStyle: {
    fontSize: 15
  },
  boldText: {
    fontSize: 15,
    color: "black"
  },
  boldTextHeader: {
    fontSize: 17,
    fontWeight: "bold",
    color: "black",
    paddingTop: 10
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold"
  },
  summaryContentA: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0DB37E"
  },
  summaryContentB: {
    fontSize: 24,
    fontWeight: "bold",
    // color: "#FF5326",
    color: "black"
  },
  alldetailsCon: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15
  },
  sumarycontent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flex: 1,
    marginBottom: 10
  },
  borderSt: {
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: "black"
  }
});

export default OneAnnonceSelected;

{
  /** internet est un reseau connecte mondialement .il donne acces des services , l'acces aux donnes */
}
