import React, { useState, useEffect } from "react";
import { View, FlatList, Text } from "react-native";
import { Appbar, Button, Card } from "react-native-paper";
import firebase from "firebase/app";
import "firebase/firestore";
import { SocialModel } from "../../../../models/social.js";
import { styles } from "./FeedScreen.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../MainStackScreen.js";

/* 
  Remember the navigation-related props from Project 2? They were called `route` and `navigation`,
  and they were passed into our screen components by React Navigation automatically.  We accessed parameters 
  passed to screens through `route.params` , and navigated to screens using `navigation.navigate(...)` and 
  `navigation.goBack()`. In this project, we explicitly define the types of these props at the top of 
  each screen component.

  Now, whenever we type `navigation.`, our code editor will know exactly what we can do with that object, 
  and it'll suggest `.goBack()` as an option. It'll also tell us when we're trying to do something 
  that isn't supported by React Navigation!
*/
interface Props {
  navigation: StackNavigationProp<MainStackParamList, "FeedScreen">;
}

export default function FeedScreen({ navigation }: Props) {
  // List of social objects
  const [socials, setSocials] = useState<SocialModel[]>([]);

  const currentUserId = firebase.auth().currentUser!.uid;

  useEffect(() => {
    const db = firebase.firestore();
    const unsubscribe = db
      .collection("socials")
      .orderBy("eventDate", "asc")
      .onSnapshot((querySnapshot) => {
        var newSocials: SocialModel[] = [];
        querySnapshot.forEach((social) => {
          const newSocial = social.data() as SocialModel;
          newSocial.id = social.id;
          newSocials.push(newSocial);
        });
        setSocials(newSocials);
      });
    return unsubscribe;
  }, []);

  const toggleInterested = (social: SocialModel) => {
    if (!social.interested) {
      social.interested = {};
    }
    if (social.interested[currentUserId]) {
      social.interested[currentUserId] = false;
    } else {
      social.interested[currentUserId] = true;
    }

    firebase
      .firestore()
      .collection("socials")
      .doc(social.id)
      .set({
        ...social,
        id: null,
      })
      .then(() => {})
      .catch((error) => {
        console.log("Error writing node:", error);
      });
  };

  const deleteSocial = (social: SocialModel) => {
    firebase.firestore().collection("socials").doc(social.id).delete();
  };

  const renderSocial = ({ item }: { item: SocialModel }) => {
    const onPress = () => {
      navigation.navigate("DetailScreen", {
        social: item,
      });
    };

    return (
      <Card onPress={onPress} style={{ margin: 16 }}>
        <Card.Cover source={{ uri: item.eventImage }} />
        <Card.Title
          title={item.eventName}
          subtitle={
            item.eventLocation +
            " • " +
            new Date(item.eventDate).toLocaleString()
          }
        />
        <Card.Actions>
          <Button onPress={() => toggleInterested(item)}>
            {item.interested && item.interested[currentUserId]
              ? "♥ Liked"
              : "♡ Like"}
          </Button>
          {item.owner === currentUserId && (
            <Button color="red" onPress={() => deleteSocial(item)}>
              {"Delete"}
            </Button>
          )}
        </Card.Actions>
      </Card>
    );
  };

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Action
          icon="exit-to-app"
          onPress={() => firebase.auth().signOut()}
        />
        <Appbar.Content title="Socials" />
        <Appbar.Action
          icon="plus"
          onPress={() => {
            navigation.navigate("NewSocialScreen");
          }}
        />
      </Appbar.Header>
    );
  };

  const ListEmptyComponent = () => {
    return (
      <View>
        <Text style={{ color: "gray", margin: 30, textAlign: "center" }}>
          {
            "Welcome! To get started, use the plus button in the top-right corner to create a new social."
          }
        </Text>
      </View>
    );
  };

  return (
    <>
      <Bar />
      <View style={styles.container}>
        <FlatList
          data={socials}
          renderItem={renderSocial}
          keyExtractor={(_, index) => "key-" + index}
          ListEmptyComponent={ListEmptyComponent}
        />
      </View>
    </>
  );
}
