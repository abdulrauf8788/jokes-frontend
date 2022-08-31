import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import defaultStyles from "../styles/defaultStyles";
import { Entypo } from "@expo/vector-icons";
import { useFonts, Andika_400Regular } from "@expo-google-fonts/andika";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

// GET https://icanhazdadjoke.com/
const API_SERVER_LINK = "https://icanhazdadjoke.com/";

// Ad Id
const adUnitId = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-7212418700180625/7610872760";

const MainScreen = () => {
  const getRandomJokeFromServer = async () => {
    setLoading(true);
    let jsonData = await fetch(API_SERVER_LINK, {
      headers: { Accept: "application/json" },
    }).then((res) => res.json());

    setLiked(false);
    setLoading(false);
    setJoke(jsonData);
  };

  const likeJoke = () => {
    if (!liked) {
      ToastAndroid.show("Added to liked jokes", ToastAndroid.SHORT);
      setLiked(true);
      // Add joke id in liked jokes
    } else {
      ToastAndroid.show("Removed from like jokes", ToastAndroid.SHORT);
      setLiked(false);
      // Remove joke from liked jokes
    }
  };

  // States
  const [joke, setJoke] = useState();
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    getRandomJokeFromServer(); // Load a joke on start
  }, []);

  // Load font
  let [fontsLoaded] = useFonts({
    Andika_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mainHeading}>Joke board</Text>
      <View style={styles.jokeContainer}>
        {loading && (
          <ActivityIndicator size="large" color={defaultStyles.SECONDARY} />
        )}
        <Text style={styles.jokeText}>{joke?.joke}</Text>

        <TouchableOpacity style={styles.likeButton} onPress={likeJoke}>
          {liked ? (
            <Entypo name="heart" size={30} color={defaultStyles.SECONDARY} />
          ) : (
            <Entypo
              name="heart-outlined"
              size={30}
              color={defaultStyles.SECONDARY}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.getJokeButton}
          onPress={getRandomJokeFromServer}
          disabled={loading}
        >
          <Text style={styles.buttonText}>New Joke</Text>
        </TouchableOpacity>
      </View>

      {/* <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      /> */}
    </View>
  );
};

const styles = new StyleSheet.create({
  container: {
    paddingTop: 40,
    backgroundColor: defaultStyles.LIGHT,
    flex: 1,
  },
  mainHeading: {
    fontSize: 28,
    padding: 20,
    textTransform: "uppercase",
    fontWeight: "bold",
    color: defaultStyles.SECONDARY,
  },
  jokeContainer: {
    padding: 30,
    minHeight: 280,
    backgroundColor: defaultStyles.PRIMARY,
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 4,
  },
  jokeText: {
    color: defaultStyles.SECONDARY,
    fontSize: 22,
    fontFamily: "Andika_400Regular",
  },
  getJokeButton: {
    padding: 15,
    width: "auto",
    backgroundColor: defaultStyles.SECONDARY,
    borderRadius: 8,
  },
  buttonText: {
    color: defaultStyles.PRIMARY,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  likeButton: {
    marginTop: 30,
    marginBottom: 20,
  },
});

export default MainScreen;
