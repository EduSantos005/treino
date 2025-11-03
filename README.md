# AppTreino

Um aplicativo móvel para registro e acompanhamento de treinos de academia, desenvolvido com React Native e Expo.

## 🏋️‍♂️ Funcionalidades

### Gerenciamento de Treinos
- ✅ Criar novos treinos a partir de um catálogo de exercícios
- ✅ Visualizar lista de treinos com categoria e quantidade de exercícios
- ✅ Editar treinos existentes
- ✅ Excluir treinos
- ✅ Armazenamento local persistente

### Gestão de Exercícios
- ✅ Adicionar múltiplos exercícios a um treino de uma só vez
- ✅ Selecionar exercícios de um catálogo com busca por nome e filtro por grupo muscular
- ✅ Preenchimento automático de nome, imagem e séries ao selecionar do catálogo

### Execução de Treino
- ✅ Registrar progresso em tempo real (reps e peso)
- ✅ Salvar o progresso para referência futura (sobrecarga progressiva)
- ✅ Marcar séries como concluídas com feedback visual e tátil (vibração)
- ✅ Timer de descanso automático iniciado após cada série
- ✅ Navegação fluida entre os exercícios do treino (carrossel)
- ✅ Alertas de confirmação inteligentes para evitar perda de dados

### Interface e Usabilidade
- ✅ Design moderno e intuitivo
- ✅ Navegação fluida entre campos com o teclado (botão "Next")
- ✅ Ajuste automático da tela para o teclado não cobrir os campos
- ✅ Validação de dados e mensagens de feedback claras
- ✅ Suporte a gestos no carrossel de exercícios

## 🛠 Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento mobile
- **Expo**: Plataforma de desenvolvimento (SDK 50+)
- **React Navigation**: Sistema de navegação
- **AsyncStorage**: Armazenamento local persistente
- **TypeScript**: Tipagem estática
- **Expo Haptics**: Feedback tátil (vibração)

## 📱 Telas

### Tela Inicial (Home)
- Lista de treinos cadastrados exibindo: Nome, Categoria e Qtd. de exercícios.
- Opções de iniciar, editar e excluir para cada treino.

### Tela de Adicionar/Editar Treino
- Formulário para nome e categoria do treino.
- Modal de seleção de exercícios com suporte à seleção múltipla, busca e filtro.

### Tela de Execução de Treino
- Interface focada no exercício atual, com navegação em carrossel.
- Inputs editáveis para registrar repetições e pesos de cada série.
- Botão para marcar série como concluída, com mudança de estado visual e feedback tátil.
- Timer de descanso automático com opção de "Pular".

## 💾 Armazenamento

Os dados são persistidos localmente usando AsyncStorage com a seguinte estrutura:

```typescript
type WorkoutCategory = 'chest-triceps' | 'back-biceps' | 'legs' | 'shoulders' | 'other';

interface Set {
  number: number;
  reps: string;
  weight: string;
  weightUnit: 'kg' | 'plates' | 'lbs';
  isCompleted?: boolean;
}

interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  imageUri?: string;
  notes?: string;
}

interface Workout {
  id: string;
  name: string;
  category: WorkoutCategory;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}
```

## 🚀 Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Inicie o projeto (use `--tunnel` se o celular não estiver na mesma rede Wi-Fi):
```bash
npx expo start
```

3. Use o aplicativo Expo Go no seu dispositivo para escanear o QR Code.

## 📝 Próximos Passos

- [ ] Criação de exercicio (Para exercício não cadastrado no app)
  - [ ] Tela no Sistema aonde o usuário pode consultar os exercícios "Padrão" já criados.


- [ ] Tracking de progresso:
  - [ ] Histórico de peso/repetições
  - [ ] Gráficos de evolução
  - [ ] Recordes pessoais
- [ ] Adicionar mais exercícios ao catálogo
- [ ] Adicionar imagens de um meio legal
- [ ] Melhorias nas anotações:
  - [ ] Links para vídeos
- [ ] Backup e sincronização:
  - [ ] Exportar/importar dados
  - [ ] Backup na nuvem
  - [ ] Sincronização entre dispositivos

## 👨‍💻 Desenvolvimento

Este projeto foi desenvolvido usando boas práticas de programação:

- Código tipado com TypeScript
- Componentização
- Hooks personalizados
- Gerenciamento de estado
- Tratamento de erros
- Feedback ao usuário
- Componentes reutilizáveis
- Persistência de dados
- Tratamento de permissões (câmera/galeria)