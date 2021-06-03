import AsyncStorage from '@react-native-async-storage/async-storage';
import Storage from 'react-native-storage';

const storage = new Storage({
  storageBackend: AsyncStorage
})

export default storage