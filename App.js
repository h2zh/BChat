// Keep this here!
import "react-native-gesture-handler";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import BadgerLoginScreen from "./components/BadgerLoginScreen";

import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import BadgerLandingScreen from "./components/BadgerLandingScreen";
import BadgerChatroomScreen from "./components/BadgerChatroomScreen";
import BadgerRegisterScreen from "./components/BadgerRegisterScreen";
import BadgerLogoutScreen from "./components/BadgerLogoutScreen";
import BadgerConversionScreen from "./components/BadgerConversionScreen";

const ChatDrawer = createDrawerNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);

  // DEBUG Only
  // SecureStore.getItemAsync("token").then((result) => {
  //   if (result) {
  //     console.log("JWT: ", result);
  //   } else {
  //     console.log("Can't get the JWT");
  //   }
  // });

  useEffect(() => {
    // load the chatroom names here
    fetch("https://cs571.org/s23/hw10/api/chatroom", {
      headers: {
        "X-CS571-ID": "bid_12a20def1bbe9e2035f9",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          Alert.alert("Something gets wrong when getting chatrooms");
        }
      })
      .then((data) => setChatrooms(data));
  }, []);

  function handleLogin(username, password) {
    fetch("https://cs571.org/s23/hw10/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CS571-ID": "bid_12a20def1bbe9e2035f9",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 401) {
          throw new Error("Incorrect password. Try again");
        } else if (res.status === 404) {
          throw new Error("That user does not exist!");
        } else {
          throw new Error("Something goes wrong");
        }
      })
      .then((data) => {
        setIsLoggedIn(true); // I should really do a fetch to login first!

        // save token(JWT) on local device's OS level
        SecureStore.setItemAsync("token", data["token"]);
      })
      .catch((err) => console.error(err));
  }

  function handleSignup(username, password) {
    fetch("https://cs571.org/s23/hw10/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CS571-ID": "bid_12a20def1bbe9e2035f9",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 400) {
          throw new Error("A request must contain a 'username' and 'password'");
        } else if (res.status === 409) {
          throw new Error("The user already exists!");
        } else {
          throw new Error("Something goes wrong");
        }
      })
      .then((data) => {
        setIsLoggedIn(true);
        // save token(JWT) on local device's OS level
        SecureStore.setItemAsync("token", data["token"]);
      })
      .catch((err) => console.error(err));
  }

  if (isLoggedIn || isGuest) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {chatrooms.map((chatroom) => {
            return (
              <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => (
                  <BadgerChatroomScreen
                    name={chatroom}
                    isLoggedIn={isLoggedIn}
                  />
                )}
              </ChatDrawer.Screen>
            );
          })}
          {isLoggedIn ? (
            <ChatDrawer.Screen name="Logout">
              {(props) => (
                <BadgerLogoutScreen {...props} setIsLoggedIn={setIsLoggedIn} />
              )}
            </ChatDrawer.Screen>
          ) : (
            <ChatDrawer.Screen name="Signup">
              {(props) => (
                <BadgerConversionScreen
                  {...props}
                  setIsRegistering={setIsRegistering}
                  setIsGuest={setIsGuest}
                />
              )}
            </ChatDrawer.Screen>
          )}
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return (
      <BadgerRegisterScreen
        handleSignup={handleSignup}
        setIsRegistering={setIsRegistering}
      />
    );
  } else {
    return (
      <BadgerLoginScreen
        handleLogin={handleLogin}
        setIsRegistering={setIsRegistering}
        setIsGuest={setIsGuest}
      />
    );
  }
}
