import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreeeHeader";
import { VStack, Heading, SectionList, Text } from "native-base";
import { useState } from "react";


export function History() {
  const [exercises, setExercises] = useState([
    {
      title: "27.08.24",
      data: ["Puxada Frontal", "Puxada Unilateral"]
    },

    {
      title: "27.08.24",
      data: ["Puxada Frontal"]
    }
  ])

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />

      <SectionList
        sections={exercises}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <HistoryCard />
        )}
        renderSectionHeader={({ section }) => (
          <Heading color="gray.200" fontSize="md" mt={10} mb={3}>
            {section.title}
          </Heading>
        )}
        px={8}
        contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: 'center' }}
        ListEmptyComponent={() => (
          <Text color="gray.100" textAlign="center">
            Você ainda não tem nenhum exercício registrado.{`\n`}
             Vamos fazer exercícios hoje? 
          </Text>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </VStack >
  )
}