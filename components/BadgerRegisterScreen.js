import { useState } from "react";
import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";

function BadgerRegisterScreen(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [comfirmPassword, setComfirmPassword] = useState("");

  const preCheckSignup = () => {
    if (password === "") {
      Alert.alert("Please enter a password");
    } else if (password !== comfirmPassword) {
      Alert.alert("Passwords do not match");
    } else {
      props.handleSignup(username, password);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 36 }}>Join BadgerChat!</Text>
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
      <Text>Comfirm Password</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={(text) => setComfirmPassword(text)} // don't need to use lambda func with e.target.value
        value={comfirmPassword}
        secureTextEntry={true}
        keyboardType="default"
      />
      <View style={styles.hstack}>
        <Button color="crimson" title="Signup" onPress={preCheckSignup} />
        <Button
          color="grey"
          title="Nevermind!"
          onPress={() => props.setIsRegistering(false)}
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
  hstack: {
    flexDirection: "row",
  },
  textInput: {
    height: 40,
    width: 250,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default BadgerRegisterScreen;
