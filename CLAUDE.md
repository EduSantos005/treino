# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com código neste repositório.

## Visão Geral do Projeto

AppTreino é uma aplicação móvel React Native + Expo para registro de treinos de academia. Construído com TypeScript em modo strict, possui arquitetura offline-first usando SQLite para persistência de dados.

**Stack Tecnológico:**
- React Native 0.81.5 + Expo SDK 54
- Expo Router para navegação baseada em arquivos
- Expo SQLite para banco de dados local
- AsyncStorage para armazenamento simples chave-valor
- TypeScript (strict mode)
- React Native Toast Message para notificações

## Comandos de Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm start

# Iniciar para plataforma específica
npm run android
npm run ios
npm run web

# Executar linter
npm run lint

# Iniciar com tunnel (para dispositivos não na mesma Wi-Fi)
npx expo start --tunnel
```

## Arquitetura

### Estrutura de Navegação (Expo Router - Baseada em Arquivos)

O app usa Expo Router com roteamento baseado em arquivos:

- `app/_layout.tsx` - Layout raiz com inicialização do banco e provider do Toast
- `app/index.tsx` - HomeScreen (lista de treinos)
- `app/AddWorkoutScreen.tsx` - Criar/editar treinos
- `app/StartWorkoutScreen.tsx` - Executar treino com cronômetro
- `app/WorkoutSummaryScreen.tsx` - Resumo pós-treino
- `app/CalendarScreen.tsx` - Calendário de histórico de treinos
- `app/ExerciseLibraryScreen.tsx` - Navegador de catálogo de exercícios

### Camada de Dados

**Sistema de armazenamento em duas camadas:**

1. **SQLite** (`src/services/database.ts`) - Banco de dados primário
   - Tabelas: `workouts`, `exercises`, `sets`, `workout_logs`
   - Gerencia templates de treinos, catálogo de exercícios e histórico
   - Schema usa campo `category` (não `type`) para categorização de treinos

2. **Storage Service** (`src/services/storage.ts`) - Camada de abstração
   - Fornece API de alto nível sobre SQLite
   - Exporta interfaces TypeScript canônicas (`Workout`, `Exercise`, `Set`, etc.)
   - **SEMPRE importe tipos daqui, nunca defina localmente**

### Padrões Arquiteturais Principais

**Otimizações de Performance:**
- Componentes como `SetRow` usam `React.memo` com comparação customizada
- Componente Timer é isolado para prevenir re-renders em cascata
- `useCallback` para memoizar funções na execução de treinos
- Durante treinos ativos, apenas componentes alterados re-renderizam

**Integridade de Dados:**
- Validação de input em tempo real no componente `SetRow`
- Validação pré-salvamento em `AddWorkoutScreen`
- Interceptação do botão voltar do hardware no Android previne perda acidental de dados
- Confirmações de Alert para ações destrutivas (excluir, sair do treino)

**Padrão UX - Toast vs Alert:**
- Use **Toast** para feedback informativo (mensagens de sucesso/erro)
- Use **Alert** para confirmações que requerem decisão do usuário (excluir, sair)
- Helper de Toast: `src/utils/toast.ts`

### Contexto Importante do Banco de Dados

**Desenvolvimento vs Produção:**

O banco de dados é **limpo e re-populado a cada início do app** durante desenvolvimento (veja `app/_layout.tsx`). Para builds de produção, esta lógica de seeding deve ser removida/comentada para preservar dados do usuário.

**Consistência de Tipos:**

O schema do banco de dados e tipos TypeScript usam `category` (não `type`). Código histórico pode referenciar `type`, mas isso foi migrado. Sempre use:
- Coluna do banco: `category`
- Propriedade TypeScript: `category: WorkoutCategory`
- Importar tipos de: `src/services/storage.ts`

### Biblioteca de Componentes

Componentes reutilizáveis em `src/components/`:
- `SetRow.tsx` - Input de série memoizado com validação
- `Timer.tsx` - Componente de cronômetro isolado
- `CategorySelector.tsx` - Seletor de categoria de treino
- `ExerciseSelector.tsx` - Seletor múltiplo de exercícios
- `ExerciseImage.tsx` - Exibição de imagem de exercício
- `WeightUnitSelector.tsx` - Seletor de unidade de peso (kg, lbs, anilhas)

### Estratégia de Validação

**Validação em duas camadas:**

1. **Tempo real** (nos componentes):
   - `SetRow` bloqueia valores negativos e caracteres inválidos conforme usuário digita
   - Suporta decimais em peso (ex: 22.5 kg)

2. **Pré-salvamento** (nas telas):
   - `AddWorkoutScreen` valida antes de salvar:
     - Nome do treino não vazio
     - Pelo menos um exercício
     - Todas séries têm reps válidas (> 0) e peso (≥ 0)

### Gerenciamento de Estado

- Estado local de componente com `useState`
- Callbacks memoizados com `useCallback` para performance
- Queries de banco de dados são async/await
- Navegação usa hook `useRouter` do Expo Router

## Padrões Importantes

### Criando/Editando Treinos

1. Usuário adiciona exercícios do catálogo (`ExerciseSelector`)
2. Cada exercício tem múltiplas séries com reps/peso
3. Validação ocorre na mudança de input E antes de salvar
4. Notificação Toast confirma salvamento
5. Navegação retorna para tela inicial

### Executando Treinos

1. Timer inicia automaticamente ao começar treino
2. Usuário navega entre exercícios (swipe/botões)
3. Marca séries como completas (feedback háptico na conclusão)
4. Botão voltar do hardware mostra confirmação de saída
5. Salva no histórico com duração ao finalizar

### Segurança de Tipos

**Crítico:** Nunca defina tipos locais `Workout`, `Exercise` ou `Set`. Sempre importe de `src/services/storage.ts` para manter consistência com schema do banco.

```typescript
// ✅ Correto
import { Workout, Exercise, Set } from '../src/services/storage';

// ❌ Errado - causa inconsistência de tipos
type Workout = { id: number; name: string; type: string; };
```

## Considerações de Performance

- Evite re-renderizar tela inteira de treino quando timer atualiza
- Use `React.memo` para itens de lista que não mudam frequentemente
- Memoize callbacks passados para componentes filhos
- Isole componentes que atualizam frequentemente (como Timer)

## Fluxo de Testes

Como não há testes automatizados, testes manuais focam em:
1. Fluxos de criar/editar/excluir treino
2. Execução de treino com cronômetro
3. Persistência de dados entre reinicializações do app (modo produção)
4. Casos extremos de validação de input
5. Comportamento do botão voltar do Android
