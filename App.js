import { StyleSheet, View } from 'react-native';
import Notification from './src/components/Notification';

export default function App() {
  return (
    <View style={styles.container}>
      <Notification></Notification>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
