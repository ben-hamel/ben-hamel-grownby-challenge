import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";

import { SafeAreaView } from "react-native-safe-area-context";

const FarmList = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Import Farms from Firebase
     */
    const getData = async () => {
      const querySnapshot = await getDocs(collection(db, "Farms"));
      const data = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setFarms(data);
      setLoading(false);
      console.log(typeof data);
    };
    getData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView>
        <View>
          <Text>Loading</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      {farms.map((farm) => (
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
      ))}
    </>
  );
};

export default FarmList;

const styles = StyleSheet.create({
  itemPhoto: {
    width: 120,
    height: 120,
  },
});
