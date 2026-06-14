import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRef } from 'react';

const APP_URL = 'https://aura-app-ten-alpha.vercel.app';

export default function App() {
  const webViewRef = useRef<WebView>(null);

  // Handle Android back button — go back in webview history
  BackHandler.addEventListener('hardwareBackPress', () => {
    webViewRef.current?.goBack();
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <WebView
        ref={webViewRef}
        source={{ uri: APP_URL }}
        style={styles.webview}
        allowsBackForwardNavigationGestures
        pullToRefreshEnabled
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
  },
});
