import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";

import { SafeAreaView } from "react-native-safe-area-context";

interface farmType {
  id: string;
  name: string;
  image: string;
  phone: string;
  openHours: string;
  displayName: string;
}

interface FarmListProps {
  modalState: boolean;
}

const FarmList = ({ modalState }: FarmListProps) => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Import Farms from Firebase
     */
    const getData = async () => {
      const querySnapshot = await getDocs(collection(db, "Farms"));
      const data = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setFarms(data);
      setLoading(false);
      // console.log(typeof data);
    };
    getData();
  }, [modalState === false]);

  if (loading) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={farms}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.itemPhoto} />
            <View style={styles.itemText}>
              <Text>Farm: {item.displayName}</Text>
              <Text>Name: {item.name}</Text>
              <Text>Phone: {item.phone}</Text>
              <Text>Hours: {item.openHours}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      {/* {farms.map((farm) => (
        <View key={farm.id}>
          <Text>Name: {farm.name}</Text>
          <Text>Display Name: {farm.displayName}</Text>
          <Text>Phone: {farm.phone}</Text>
          <Text>Open Hours: {farm.openHours}</Text>
          <Image
            source={{
              uri: farm.image,
            }}
            style={styles.itemPhoto}
            resizeMode="cover"
          />
        </View>
      ))} */}
    </>
  );
};

export default FarmList;

const styles = StyleSheet.create({
  itemPhoto: {
    width: 120,
    height: 120,
  },
  item: {
    flexDirection: "row",
    padding: 10,
    // borderColor: "black",
    // borderWidth: 1,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  itemText: {
    flex: 1,
    marginLeft: 10,
  },
});
