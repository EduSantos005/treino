import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface ExerciseImageProps {
  imageUri?: string;
  onImageSelected?: (uri: string) => void;
}

export function ExerciseImage({ imageUri, onImageSelected }: ExerciseImageProps) {
  // Se a imagem é do StrengthLevel, não permite edição
  const isDefaultImage = imageUri?.startsWith('https://static.strengthlevel.com');
  
  const pickImage = async () => {
    if (isDefaultImage || !onImageSelected) return;

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de permissão para acessar suas fotos.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
  };

  const takePhoto = async () => {
    if (isDefaultImage || !onImageSelected) return;

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de permissão para usar sua câmera.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível tirar a foto');
    }
  };

  const showImageOptions = () => {
    if (isDefaultImage || !onImageSelected) return;

    Alert.alert(
      'Adicionar Foto',
      'Escolha uma opção',
      [
        {
          text: 'Tirar Foto',
          onPress: takePhoto,
        },
        {
          text: 'Escolher da Galeria',
          onPress: pickImage,
        },
        {
          text: imageUri ? 'Remover Foto' : 'Cancelar',
          style: imageUri ? 'destructive' : 'cancel',
          onPress: () => {
            if (imageUri) {
              onImageSelected('');
            }
          },
        },
      ],
    );
  };

  return (
    <TouchableOpacity 
      onPress={showImageOptions} 
      style={styles.container}
      disabled={isDefaultImage || !onImageSelected}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : onImageSelected ? (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Adicionar Foto</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
});