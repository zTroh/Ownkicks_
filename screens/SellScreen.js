import * as WebBrowser from "expo-web-browser";
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  StatusBar
} from "react-native";
import { WebView } from "react-native-webview";
import Header from "../components/Header";
import HomeArrayOfLinks from "../components/Functions";
import ActivitysIndicator from "../components/ActivityIndicator";

const INJECTED_JAVASCRIPT = `(function() {
  const tokenLocalStorage = window.localStorage.getItem('token');
  window.ReactNativeWebView.postMessage(tokenLocalStorage);
})();`;


export default class HomeScreen extends Component {
  state = {
    WEBVIEW_REF: "WEBVIEW_REF",
    url: "https://ownkicks.com/inbox/orders",
    titleStacks: [],
    deletedStacks: [],
    backButtonEnabled: false,
    forwardButtonEnabled: false
  };

  _onNavigationStateChange = navState => {
    const { forwardButtonEnabled, backButtonEnabled, url, title } = this.state;
    if (
      forwardButtonEnabled !== navState.canGoForward ||
      backButtonEnabled !== navState.canGoBack
    ) {
      //Making sure that the app do not re-render if there are no changeset
      this.setState({
        backButtonEnabled: navState.canGoBack,
        forwardButtonEnabled: navState.canGoForward
      });
    }
    this._navigateToOtherTab(navState);
  };
  /*
    1: This will run after the webview is done loading. this will get the real title of the webview app
    2: the _headerTitle function will return me the shorter string of the title
    3: the title wont be added to the titleStacks array if it the titleStacks has it

  */
  _onLoadEnd = ({ nativeEvent }) => {
    if (!this.state.titleStacks.includes(nativeEvent.title)) {
      const smallTitle = this._headerTitle(nativeEvent.title);
      if (nativeEvent.title === "- OwnKicks") {
        this.setState(state => ({
          titleStacks: [...state.titleStacks, "Browse All"],
          oldLength: (state.oldLength += 1)
        }));
      } else {
        this.setState(state => ({
          titleStacks: [...state.titleStacks, smallTitle],
          oldLength: (state.oldLength += 1)
        }));
      }
    }
    console.log(nativeEvent);
  };

  // Making the title of the url shorter
  _headerTitle = navTitle => {
    const splitted = navTitle.split(" ");
    if (navTitle.includes("blog")) return "Blog";

    if (splitted.length >= 4) {
      let title1 = `${splitted[1]} ${splitted[2]} ${splitted[3]}`;
      let title2 = `${splitted[0]} ${splitted[1]} ${splitted[2]} ${splitted[3]}`;

      if (splitted[0] === "OwnKicks" && splitted[1] === "-") {
        return `${splitted[2]} ${splitted[3]} ${splitted[4]}`;
      }
      return splitted[0] === "-" ? title1 : title2;
    } else if (splitted.length === 3) {
      let title1 = `${splitted[1]} ${splitted[2]}`;
      let title2 = `${splitted[0]} ${splitted[1]} ${splitted[2]}`;
      return splitted[0] === "-" ? title1 : title2;
    } else if (splitted.length === 2) {
      let title1 = `${splitted[1]}`;
      let title2 = `${splitted[0]} ${splitted[1]}`;
      if (title2 == "- OwnKicks") {
        return "Browse All";
      }

      return splitted[0] === "-" ? title1 : title2;
    }
    return splitted;
  };

  _navigateToOtherTab = navState => {
    const buy = "https://www.ownkicks.com/s?category=all";
    const freeShipping =
      "https://www.ownkicks.com/s?category=all&view=grid&price_min=0&price_max=5000&filter_option_448028=448028";
    const home = "https://www.ownkicks.com/";

    if (navState.url === buy) {
      this.refs[this.state.WEBVIEW_REF].reload();
      this.props.navigation.navigate("Buy");
    } else if (navState.url === home) {
      this.refs[this.state.WEBVIEW_REF].reload();
      this.props.navigation.navigate("HomeStack");
    } else if (navState.url === freeShipping) {
      this.refs[this.state.WEBVIEW_REF].reload();
      this.props.navigation.navigate("Buy", {
        url: navState.url,
        title: "Free Shipping"
      });
    }
  };
  /*
    THIS IS BASELY DELETED THE TOP TITILE IN THE ARRAY BECAUSE THE APP DISPLAY THE LAST TITLE IN THE TITLESTACKS ARRAY.
    BY DELETED THE LAST TITLE ELEMENT FROM THE ARRAY.THE APP CAN SHOW THE USER THE PREV TITLE. HOWEVER, THE DELETED TITLE WILL BE ADDED TO ANOTHER ARRAY
    SO IT CAN BE ADDED BACK TO THE TITLESTACKS ARRAY WHEN THE USER CLICKED THE FORWARD BUTTON
    */
  _goBack = () => {
    //pop off the last tile in the title-stock
    this.setState(state => {
      const poppedTitle = state.titleStacks;
      let old = "";
      if (poppedTitle.length > 1) {
        old = poppedTitle.pop();
        return {
          ...state,
          titleStacks: poppedTitle,
          deletedStacks: [...state.deletedStacks, old]
        };
      }
      return {
        ...state,
        titleStacks: poppedTitle,
        deletedStacks: [...state.deletedStacks]
      };
    });
    this.refs[this.state.WEBVIEW_REF].goBack();
  };
  /*
    1: Get the deleted titles and assigned it to poppedTitle
    2: create a new binding
    3: check the poppedtitle length. Because you don't wanna pop a empty list
    4: if the length is greater than 1 
        1: assigned the lass element to a newly created binding 
        2: it will also delete the last element as it assigning it to the newly created binding
        return the state, add the deleted element to titleStacks and add back the popptitle to the deletedStacks
    5: else return everything as it was without deleted anything 

    THIS IS BASELY ADDED BACK THE DELETED TITLE TO THE TITLESACKS ARRAY
    */
  _goForward = () => {
    this.setState(state => {
      const poppedTitle = state.deletedStacks;
      let old = "";
      if (poppedTitle.length >= 1) {
        old = poppedTitle.pop();
        return {
          ...state,
          titleStacks: [...state.titleStacks, old],
          deletedStacks: poppedTitle
        };
      }
      return {
        ...state,
        titleStacks: [...state.titleStacks],
        deletedStacks: poppedTitle
      };
    });
    this.refs[this.state.WEBVIEW_REF].goForward();
  };
  _renderLoading = () => <ActivitysIndicator />;

  render() {
    const {
      forwardButtonEnabled,
      backButtonEnabled,
      WEBVIEW_REF,
      url,
      titleStacks
    } = this.state;
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" />
          <Header
            goback={this._goBack}
            goForward={this._goForward}
            forwardButtonEnabled={forwardButtonEnabled}
            backButtonEnabled={backButtonEnabled}
            title={titleStacks[titleStacks.length - 1]}
          />
          <WebView
            useWebKit={true}
            javaScriptEnabledAndroid={true}
            source={{ url: url }}
            ref={WEBVIEW_REF}
            onLoadEnd={this._onLoadEnd}
            renderLoading={this._renderLoading}
            onNavigationStateChange={this._onNavigationStateChange}
            startInLoadingState={true}
            injectedJavaScript={INJECTED_JAVASCRIPT}
          />
        </SafeAreaView>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
