# AppTreino

Um aplicativo móvel para registro e acompanhamento de treinos de academia, desenvolvido com React Native e Expo.

## 🏋️‍♂️ Funcionalidades

### Gerenciamento de Treinos
- ✅ Criar novos treinos
- ✅ Visualizar lista de treinos
- ✅ Editar treinos existentes
- ✅ Excluir treinos
- ✅ Armazenamento local persistente
- ✅ Categorização de treinos

### Gestão de Exercícios
- ✅ Adicionar múltiplos exercícios a um treino
- ✅ Remover exercícios específicos
- ✅ Para cada exercício:
  - Nome do exercício
  - Número de séries
  - Número de repetições
  - Peso em kg
  - Foto do exercício (câmera ou galeria)

### Interface do Usuário
- ✅ Design moderno e intuitivo
- ✅ Navegação fluida entre campos
- ✅ Validação de dados
- ✅ Feedback visual para ações
- ✅ Suporte a gestos
- ✅ Adaptação automática ao teclado
- ✅ Visualização de fotos dos exercícios
- ✅ Indicador de exercícios com fotos na lista

### Usabilidade
- ✅ Navegação automática entre campos usando Return/Enter
- ✅ Limitação inteligente de caracteres em campos numéricos
- ✅ Teclado numérico para campos apropriados
- ✅ Confirmação para ações importantes
- ✅ Mensagens de feedback claras
- ✅ Opção de tirar foto ou escolher da galeria
- ✅ Edição de fotos antes de salvar

## 🛠 Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento mobile
- **Expo**: Plataforma de desenvolvimento
- **React Navigation**: Sistema de navegação
- **AsyncStorage**: Armazenamento local persistente
- **TypeScript**: Tipagem estática
- **React Hooks**: Gerenciamento de estado
- **Safe Area Context**: Adaptação a diferentes dispositivos
- **Expo Image Picker**: Captura e seleção de imagens

## 📱 Telas

### Tela Inicial (Home)
- Lista de treinos cadastrados
- Botão para adicionar novo treino
- Opções de editar e excluir para cada treino
- Estado vazio com mensagem apropriada
- Indicador de exercícios com fotos
- Categorias dos treinos

### Tela de Adicionar/Editar Treino
- Formulário intuitivo
- Campos otimizados para entrada de dados
- Navegação automática entre campos
- Validações em tempo real
- Suporte a fotos dos exercícios
- Seleção de categoria do treino

## 💾 Armazenamento

Os dados são persistidos localmente usando AsyncStorage com a seguinte estrutura:

```typescript
type WorkoutCategory = 'chest-triceps' | 'back-biceps' | 'legs' | 'shoulders' | 'other';

interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  weight: string;
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
  isTemplate?: boolean;
}
```

## 🚀 Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Inicie o projeto:
```bash
npx expo start --tunnel
```

3. Use o aplicativo Expo Go no seu dispositivo para escanear o QR Code

## 📝 Próximos Passos

- [x] Adicionar categorias de treinos (Peito/Tríceps, Costas/Bíceps, etc.)
- [x] Adicionar suporte a fotos dos exercícios (câmera e galeria)
- [ ] Suporte a diferentes unidades de medida:
  - [ ] Peso em kg/lbs
  - [ ] Número de placas
  - [ ] Bandas elásticas
- [ ] Sistema de templates de treino:
  - [ ] Salvar treino como template
  - [ ] Criar novo treino a partir de template
  - [ ] Gerenciar templates
- [ ] Melhorias nas anotações:
  - [ ] Notas por exercício
  - [ ] Rich text com formatação
  - [ ] Links para vídeos
- [ ] Tracking de progresso:
  - [ ] Histórico de peso/repetições
  - [ ] Gráficos de evolução
  - [ ] Recordes pessoais
- [ ] Melhorias na experiência com fotos:
  - [ ] Zoom em fotos
  - [ ] Múltiplas fotos por exercício
  - [ ] Comparação de fotos (antes/depois)
  - [ ] Compartilhamento de fotos
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
