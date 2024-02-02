
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from "native-base";
import { ScreenHeader } from "@components/ScreeeHeader";
import { UserPhoto } from "@components/UserPhoto";
import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Controller, useForm } from 'react-hook-form'
import { useAuth } from "@hooks/useAuth";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";

const PHOTO_SIZE = 33;

type FormDataProps = {
  name: string;
  email: string;
  password?: string;
  old_Password?: string;
  confirm_password?: string;
}

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome'),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos.')
    .nullable()
    .transform((value) => value || null),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => value || null)
    .oneOf([yup.ref('password'), null], 'A confirmação de senha não confere.')
    .when('password', {
      is: (Field: any) => Field,
      then: (schema) =>
        schema
          .nullable()
          .required('Informe a confirmação da senha.')
          .transform((value) => value || null),
    }),
})


export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [userPhoto, setUserPhoto] = useState('https://github.com/AlessandroLobo.png')

  const toast = useToast()

  const { user } = useAuth()

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps | any>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema)
  })

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
            title: 'Erro ao carregar a imagem',
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

  async function handleProfileUpdate(data: FormDataProps) {
    console.log(data)
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

          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message as string}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="E-mail"
                onChangeText={onChange}
                value={value}
              />
            )}
          />

        </Center>
        <VStack px={10} mt={12} mb={9}>
          <Heading color="gray.200" fontSize="md" mb={2}>
            Alterar Senha
          </Heading>

          <Controller
            control={control}
            name="old_Password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Senha antiga"
                secureTextEntry
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message as string}
              />
            )}
          />


          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="confirmar a nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.confirm_password?.message as string}
              />
            )}
          />
          <Button
            title="Atualizar"
            mt={6}
            onPress={handleSubmit(handleProfileUpdate)}

          />
        </VStack>
      </ScrollView>
    </VStack>
  )
}