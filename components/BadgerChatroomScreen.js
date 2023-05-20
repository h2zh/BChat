import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View, TextInput } from "react-native";
import BadgerChatMessage from "./BadgerChatMessage";
import { ScrollView } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import BadgerCard from "./BadgerCard";
import * as SecureStore from "expo-secure-store";

function BadgerChatroomScreen(props) {
  const [msgs, setMsgs] = useState([]);

  const [popoutShown, setPopoutShown] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const closeModal = () => {
    setPopoutShown(false);
  };

  const createPost = () => {
    SecureStore.getItemAsync("token").then((token) => {
      fetch(`https://cs571.org/s23/hw10/api/chatroom/${props.name}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CS571-ID": "bid_12a20def1bbe9e2035f9",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          content: body,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            // console.log(res.status, props.chatroom);
            throw new Error("Something goes wrong when creating a new post");
          }
        })
        .then((data) => {
          // console.log(data);

          setPopoutShown(false);
          setTitle("");
          setBody("");
          getLatestMsgs();
        })
        .catch((err) => console.error(err));
    });
  };

  const getLatestMsgs = () => {
    fetch(`https://cs571.org/s23/hw10/api/chatroom/${props.name}/messages`, {
      headers: {
        "X-CS571-ID": "bid_12a20def1bbe9e2035f9",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error("Something gets wrong when getting chatroom msgs");
        }
      })
      .then((data) => setMsgs(data["messages"]));
  };

  useEffect(() => {
    getLatestMsgs();
  }, []); // TODO: maybe need to refresh the page later
  //   console.log(msgs.length);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {/* <Text style={{ margin: 100 }}>This is a chatroom screen!</Text> */}
        {msgs.length > 0
          ? msgs.map((m) => {
              return <BadgerChatMessage key={m.id} {...m} />;
            })
          : null}
      </ScrollView>
      {props.isLoggedIn ? (
        <Button
          color="crimson"
          title="Add Post"
          onPress={() => setPopoutShown(true)}
        />
      ) : null}
      <Button color="crimson" title="Refresh" onPress={getLatestMsgs} />
      <Modal isVisible={popoutShown}>
        <BadgerCard>
          <Text>Create A Post</Text>
          <Text>Title</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setTitle(text)} // don't need to use lambda func with e.target.value
            value={title}
            keyboardType="default"
          />
          <Text>Body</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setBody(text)} // don't need to use lambda func with e.target.value
            value={body}
            keyboardType="default"
          />

          <Button title="Create Post" onPress={createPost} />
          <Button title="Cancel" onPress={closeModal} />
        </BadgerCard>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    height: 40,
    width: 350,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default BadgerChatroomScreen;
