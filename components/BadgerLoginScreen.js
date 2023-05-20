import { useState } from "react";
import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";

function BadgerLoginScreen(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 36 }}>BadgerChat Login</Text>
      <Text>Username</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={(text) => setUsername(text)} // don't need to use lambda func with e.target.value
        value={username}
        keyboardType="default"
      />
      <Text>Password</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={(text) => setPassword(text)} // don't need to use lambda func with e.target.value
        value={password}
        secureTextEntry={true}
        keyboardType="default"
      />
      <Button
        color="crimson"
        title="Login"
        onPress={() => {
          props.handleLogin(username, password);
        }}
      />
      <Text>New here?</Text>
      <View style={styles.hstack}>
        <Button
          color="grey"
          title="Signup"
          onPress={() => props.setIsRegistering(true)}
        />
        <Button
          color="grey"
          title="Continue As Guest"
          onPress={() => props.setIsGuest(true)}
        />
      </View>
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
    width: 250,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  hstack: {
    flexDirection: "row",
  },
});

export default BadgerLoginScreen;
