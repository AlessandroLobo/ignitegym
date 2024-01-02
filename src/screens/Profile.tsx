
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from "native-base";
import { ScreenHeader } from "@components/ScreeeHeader";
import { UserPhoto } from "@components/UserPhoto";
import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const PHOTO_SIZE = 33;

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [userPhoto, setUserPhoto] = useState('https://github.com/AlessandroLobo.png')

  const toast = useToast()

  // Carrega a foto da galeria
  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true)
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        alert('Selecione uma foto')
        return
      }

      if (photoSelected.assets) {
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri)

        if (photoInfo.exists && photoInfo.size && (photoInfo.size / 1024 / 1024) > 5) {
          return toast.show({

            //usando toast --------------------------------------------------------------
            title: 'Erro ao carrregar a imagem',
            description: 'Imagem muito grande Escolha uma imagem menor que 5mb',
            placement: 'top',
            bgColor: 'red.500',
          })
          //usando toast ----------------------------------------------------------------

        } else {
          setUserPhoto(photoSelected.assets[0].uri)
        }

      }

    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }


  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt={6} px={10}>
          {photoIsLoading ?
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded={"full"}
              startColor="gray.500"
              endColor="blueGray.400"
            />
            :
            <UserPhoto
              source={{ uri: userPhoto }}
              alt="Foto do usuário"
              size={PHOTO_SIZE}
            />
          }

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
              Alterar foto
            </Text>
          </TouchableOpacity>
          <Input
            bg="gray.600"
            placeholder="Nome"
          />
          <Input
            bg="gray.600"
            value="alessandro.lobo@hotmail.com"
            isDisabled
          />
        </Center>
        <VStack px={10} mt={12} mb={9}>
          <Heading color="gray.200" fontSize="md" mb={2}>
            Alterar Senha
          </Heading>
          <Input
            bg="gray.600"
            placeholder="Senha antiga"
            secureTextEntry
          />
          <Input
            bg="gray.600"
            placeholder="Nova senha"
            secureTextEntry
          />
          <Input
            bg="gray.600"
            placeholder="confirmar a nova senha"
            secureTextEntry
          />
          <Button
            title="Atualizar"
            mt={6}

          />
        </VStack>
      </ScrollView>
    </VStack>
  )
}