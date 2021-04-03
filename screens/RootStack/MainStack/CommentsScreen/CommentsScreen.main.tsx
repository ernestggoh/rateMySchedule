import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { ScrollView, Image, Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import { MainStackParamList } from "../MainStackScreen";
import { styles } from "./CommentsScreen.styles";

interface Props {
  navigation: StackNavigationProp<MainStackParamList, "CommentsScreen">;
  route: RouteProp<MainStackParamList, "CommentsScreen">;
}

export default function CommentsScreen({ route, navigation }: Props) {
  const { social } = route.params;

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate("DetailScreen", {
        social: social,
      })} />
        <Appbar.Content title="Comments" />
      </Appbar.Header>
    );
  };

  return (
    <>
      <Bar />
      <ScrollView style={styles.container}>
        <View style={styles.view}>
          <Image style={styles.image} source={{ uri: social.eventImage }} />
          <Text style={{ ...styles.h1, marginVertical: 10 }}>
            {social.eventName}
          </Text>
          <Text style={{ ...styles.subtitle, marginBottom: 5 }}>
            {social.eventLocation}
          </Text>
          <Text style={{ ...styles.subtitle, marginTop: 5, marginBottom: 20 }}>
            {new Date(social.eventDate).toLocaleString()}
          </Text>
          <Text style={styles.body}>{social.eventDescription}</Text>
        </View>
      </ScrollView>
    </>
  );
}
