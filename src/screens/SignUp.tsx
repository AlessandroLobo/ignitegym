import { useNavigation } from "@react-navigation/native";
import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from "native-base";

import LogoSvg from "@assets/logo.svg";
import BackgroundImg from "@assets/background.png";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useForm, Controller } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "@services/api";
import { Alert } from "react-native";
import { AppError } from "@utils/AppError";
import { useState } from "react";
import { useAuth } from "@hooks/useAuth";

type formDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;

}

const signUpSchema = yup.object({
  name: yup.string().required('O nome é obrigatório'),
  email: yup.string().required('O e-mail é obrigatório').email('E-mail inválido'),
  password: yup.string().required('A senha é obrigatória').min(6, 'A senha precisa ter no mínimo 6 caracteres'),
  password_confirm: yup.string().required().oneOf([
    yup.ref('password'),
  ], 'As senhas precisam ser iguais')
})

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();

  const toast = useToast();

  const navigation = useNavigation();

  const { control, handleSubmit, formState: { errors } } = useForm<formDataProps>({
    resolver: yupResolver(signUpSchema)
  });

  function handleNewGoBack() {
    navigation.goBack();
  }

  async function handleSignUp({ name, email, password }: formDataProps) {
    try {
      setIsLoading(true)

      await api.post('/users', { name, email, password })
      await signIn(email, password)


    } catch (error) {
      setIsLoading(false)
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível criar conta. Tente novamente mais tarde';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px="10" pb={16}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          resizeMode="contain"
          position="absolute"
        />
        <Center my={24}>
          <LogoSvg
          />
          <Text color="gray.100" fontSize="sm">
            Treine sua mente e seu corpo
          </Text>
        </Center>
        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Crie sua conta
          </Heading>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />


          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password_confirm"
            render={({ field: { onChange, value } }) => (
              <Input placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password_confirm?.message}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
              />
            )}
          />
          <Button
            title="Criar e Acessar"
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
          <Button
            title="Voltar para o Login"
            variant="outline"
            mt={24}
            onPress={handleNewGoBack}
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}