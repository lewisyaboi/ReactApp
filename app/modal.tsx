import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function ModalScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is your Modal!</Text>
      <Text>Put forms, lists, inputs, images, whatever here.</Text>

      <Button title="Close Modal" onPress={() => router.back()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
