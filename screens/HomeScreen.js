import React, { Component } from "react";
import { StyleSheet, View, SafeAreaView, StatusBar } from "react-native";
import { WebView } from "react-native-webview";
import HomeArrayOfLinks from "../components/Functions";
import Header from "../components/Header";
import ActivitysIndicator from "../components/ActivityIndicator";

const INJECTED_JAVASCRIPT = `(function() {
  const tokenLocalStorage = window.localStorage.getItem('token');
  window.ReactNativeWebView.postMessage(tokenLocalStorage);
})();`;

export default class HomeScreen extends Component {
  state = {
    WEBVIEW_REF: "weViewRed",
    url: "https://ownkicks.com/",
    titleStacks: [],
    deletedStacks: [],
    backButtonEnabled: false,
    forwardButtonEnabled: false,
    homeUrl1: "https://ownkicks.com/"
  };
  onNavigationStateChange = navState => {
    console.log(navState)
    const { forwardButtonEnabled, backButtonEnabled, url } = this.state;
    if (
      forwardButtonEnabled !== navState.canGoForward ||
      backButtonEnabled !== navState.canGoBack
    ) {
      url !== "https://ownkicks.com/"
        ? this.setState({
            backButtonEnabled: navState.canGoBack,
            forwardButtonEnabled: navState.canGoForward,
            loading: navState.loading
          })
        : undefined;
    }

    this._navigateToOtherTab(navState);
    if (url === "https://ownkicks.com") {
      //when the user clicked on the logo
      this._ownkicksIconClicked(navState);
    }
  };
  //making sure the header do not show when the user clicked on the logo
  // it will turn the backbutton and the forwaredbutton to false
  // when both buttons are false. the header wont show
  _ownkicksIconClicked = navState => {
    this.setState({
      backButtonEnabled: false,
      forwardButtonEnabled: false
    });
  };

  /*
   This function will loop through the all the links that has to do with the BUY SCREEN
   Will send the rightful url and the rightful title to the BUY SCREEN 
   If linked the user clicked on is not included inside the HomeArray the Home page will load the url
  */
  _navigateToOtherTab = navState => {
    const nativeToBuy = HomeArrayOfLinks.includes(navState.url);
    if (nativeToBuy) {
      const title = this._sendTheRightTitleString(navState.url);
      this.refs[this.state.WEBVIEW_REF].reload();
      this.props.navigation.navigate("Buy", {
        url: navState.url,
        title: title
      });
    } else if (this.state.url !== navState.url) {
      this.setState({ url: navState.url });
    }
  };

  // This function is making sure the rightful title is getting sent to the buy page
  _sendTheRightTitleString = url => {
    let title = false;
    switch (url) {
      case "https://www.ownkicks.com/s?category=all&view=grid&price_min=0&price_max=5000&checkbox_filter_option_341082=341082":
        title = "New Balances";
        break;
      case "https://www.ownkicks.com/s?category=all&view=grid&price_min=0&price_max=5000&checkbox_filter_option_341083=341083":
        title = "Nikes";
        break;
      case "https://www.ownkicks.com/s?category=all&view=grid&price_min=0&price_max=5000&checkbox_filter_option_341084=341084":
        title = "Air Jordans";
        break;
      case "https://www.ownkicks.com/s?category=all&view=grid&price_min=0&price_max=5000&checkbox_filter_option_341226=341226":
        title = "Pumas";
        break;
      case "https://www.ownkicks.com/s?category=all&view=grid&price_min=0&price_max=5000&checkbox_filter_option_385853=385853":
        title = "Yeezys";
        break;
      case "https://www.ownkicks.com/s?category=all&view=grid&price_min=0&price_max=5000&checkbox_filter_option_341079=341079":
        title = "Adidas";
        break;
      case "https://www.ownkicks.com/s?category=all&view=grid&price_min=0&price_max=5000&filter_option_448028=448028":
        title = "Free Shipping";
        break;
      default:
        break;
    }
    return title;
  };

  /*
    1: This will run after the webview is done loading. this will get the real title of the webview app
    2: the _headerTitle function will return me the shorter string of the title
    3: the title wont be added to the titleStacks array if it the titleStacks has it

  */
  _onLoadEnd = ({ nativeEvent }) => {
    const smallTitle = this._headerTitle(nativeEvent.title);
    if (!this.state.titleStacks.includes(smallTitle)) {
      this.setState(state => ({
        titleStacks: [...state.titleStacks, smallTitle]
      }));
    }
  };
  // Making the title of the url shorter
  _headerTitle = navTitle => {
    const splitted = navTitle.split(" ");
    if (navTitle.includes("blog")) return "Blog";

    if (splitted.length >= 4) {
      let title1 = `${splitted[1]} ${splitted[2]} ${splitted[3]}`;
      let title2 = `${splitted[0]} ${splitted[1]} ${splitted[2]} ${splitted[3]}`;

      if (splitted[0] === "OwnKicks" && splitted[1] === "-") {
        // Making sure the ownkciks and the - do not be the first string to show
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
  _goBack = () => {
    /*
    THIS IS WILL DELETE THE TOP TITILE IN THE ARRAY BECAUSE THE APP DISPLAY THE LAST TITLE IN THE TITLESTACKS ARRAY.
    BY DELETED THE LAST TITLE ELEMENT FROM THE ARRAY.THE APP CAN SHOW THE USER THE PREV TITLE. HOWEVER, THE DELETED TITLE WILL BE ADDED TO ANOTHER ARRAY
    SO IT CAN BE ADDED BACK TO THE TITLESTACKS ARRAY WHEN THE USER CLICKED THE FORWARD BUTTON
    */
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
  _goForward = () => {
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
      title,
      titleStacks
    } = this.state;
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" />
          {this.state.url !== this.state.homeUrl1 && (
              <Header
                goback={this._goBack}
                goForward={this._goForward}
                forwardButtonEnabled={forwardButtonEnabled}
                backButtonEnabled={backButtonEnabled}
                title={titleStacks[titleStacks.length - 1]}
              />
            )}
          <WebView
            javaScriptEnabledAndroid={true}
            useWebKit={true}
            source={{ url: url }}
            ref={WEBVIEW_REF}
            scalesPageToFit={true}
            onLoadEnd={this._onLoadEnd}
            renderLoading={this._renderLoading}
            onNavigationStateChange={this.onNavigationStateChange}
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
