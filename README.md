# AppTreino

Um aplicativo móvel para registro e acompanhamento de treinos de academia, desenvolvido com React Native e Expo.

## 🏋️‍♂️ Funcionalidades

### Gerenciamento de Treinos
- ✅ Criar novos treinos a partir de um catálogo de exercícios
- ✅ Visualizar lista de treinos com categoria e quantidade de exercícios
- ✅ Editar treinos existentes
- ✅ Excluir treinos
- ✅ Armazenamento local persistente
- ✅ **Validação de Dados:** Impede criação de treinos com nome vazio ou valores inválidos
- ✅ **Imagens de Exercícios:** As imagens dos exercícios são salvas e exibidas corretamente nas telas de treino e execução.

### Gestão de Exercícios
- ✅ Adicionar múltiplos exercícios a um treino de uma só vez
- ✅ Selecionar exercícios de um catálogo com busca por nome e filtro por grupo muscular
- ✅ Catálogo expandido com mais exercícios comuns de academia.
- ✅ Preenchimento automático de nome, imagem e séries ao selecionar do catálogo

### Execução de Treino
- ✅ **Cronômetro de Treino:**  Um cronômetro é iniciado junto com o treino e continua em segundo plano.
- ✅ **Tela de Resumo:** Ao finalizar, uma tela exibe o nome e a duração total do treino.
- ✅ Registrar progresso em tempo real (reps e peso)
- ✅ Salvar o progresso para referência futura (sobrecarga progressiva)
- ✅ Marcar séries como concluídas com feedback visual e tátil (vibração)
- ✅ **Timer de Descanso Aprimorado:** O timer de descanso agora funciona corretamente mesmo se o aplicativo for para o segundo plano.
- ✅ Navegação fluida entre os exercícios do treino (carrossel)
- ✅ **Proteção contra Perda de Dados:** Alerta de confirmação ao tentar sair do treino em andamento
- ✅ **Suporte a Hardware Back Button:** Intercepta botão voltar do Android para prevenir saída acidental

### Histórico de Treinos
- ✅ Registro detalhado de treinos concluídos, incluindo exercícios, séries, repetições e pesos.
- ✅ **Duração do Treino:** A duração total de cada treino agora é salva no histórico.
- ✅ Visualização do histórico em um calendário interativo.
- ✅ Armazenamento persistente no banco de dados SQLite.

### Interface e Usabilidade
- ✅ Design moderno e intuitivo
- ✅ Navegação fluida entre campos com o teclado (botão "Next")
- ✅ Ajuste automático da tela para o teclado não cobrir os campos
- ✅ **Validação em Tempo Real:** Inputs bloqueiam valores negativos e caracteres inválidos durante a digitação
- ✅ **Validação Pré-salvamento:** Verifica integridade de dados antes de salvar treinos
- ✅ **Toast Notifications:** Feedback visual moderno e não intrusivo para ações de sucesso e erro
- ✅ Mensagens de feedback claras e específicas para cada tipo de erro
- ✅ Suporte a gestos no carrossel de exercícios
- ✅ **Posicionamento de Títulos:** Ajuste fino no posicionamento dos títulos das telas para uma melhor estética e consistência.
- ✅ **Navegação Aprimorada:** Texto do atalho 'Biblioteca' alterado para 'Exercícios' para maior clareza.

### Performance
- ✅ **Componentes Memoizados:** SetRow otimizado com React.memo para evitar re-renderizações desnecessárias
- ✅ **Timer Isolado:** Cronômetro em componente separado para performance otimizada
- ✅ **useCallback:** Funções memoizadas para evitar recriação em cada render
- ✅ **Renderização Eficiente:** Apenas componentes afetados são re-renderizados durante treino ativo

## 🛠 Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento mobile
- **Expo**: Plataforma de desenvolvimento (SDK 50+)
- **React Navigation**: Sistema de navegação
- **Expo-SQLite**: Banco de dados local para persistência de dados offline-first
- **TypeScript**: Tipagem estática (strict mode)
- **Expo Haptics**: Feedback tátil (vibração)
- **React Native Toast Message**: Notificações toast modernas e customizáveis

## 📱 Telas

### Tela Inicial (Home)
- Lista de treinos cadastrados exibindo: Nome, Categoria e Qtd. de exercícios.
- Opções de iniciar, editar e excluir para cada treino.

### Tela de Adicionar/Editar Treino
- Formulário para nome e categoria do treino.
- Modal de seleção de exercícios com suporte à seleção múltipla, busca e filtro.

### Tela de Execução de Treino
- Cronômetro geral do treino visível no cabeçalho.
- Interface focada no exercício atual, com navegação em carrossel.
- Inputs editáveis para registrar repetições e pesos de cada série.
- Botão para marcar série como concluída, com mudança de estado visual e feedback tátil.
- Timer de descanso automático com opção de "Pular".

### Tela de Resumo do Treino
- Exibida ao finalizar um treino.
- Mostra o nome do treino e a duração total.
- Botão para retornar à tela inicial.

### Tela de Histórico (Calendar)
- Visualização de treinos concluídos em um calendário.
- Detalhes dos treinos registrados para cada dia.

## 💾 Armazenamento

Os dados são persistidos localmente usando **Expo-SQLite**, garantindo que o aplicativo funcione 100% offline. O histórico de treinos agora também é armazenado no SQLite para maior robustez e consistência. Exercícios personalizados ainda utilizam `AsyncStorage`.

A estrutura do banco de dados é a seguinte:

**Tabela `workouts`**
| Coluna | Tipo    | Descrição                                       |
|--------|---------|-------------------------------------------------|
| id     | INTEGER | Chave primária, auto-incremento                 |
| name   | TEXT    | Nome do treino                                  |
| date   | TEXT    | Data de criação/última atualização do treino (ISO 8601) |
| category | TEXT  | Categoria do treino (ex: 'chest-triceps')       |

**Tabela `exercises`**
| Coluna    | Tipo    | Descrição                                     |
|-----------|---------|-----------------------------------------------|
| id        | INTEGER | Chave primária, auto-incremento               |
| name      | TEXT    | Nome do exercício (único)                     |
| category  | TEXT    | Grupo muscular principal (ex: 'peito')        |
| image_uri | TEXT    | URI da imagem do exercício                    |

**Tabela `sets`**
| Coluna      | Tipo    | Descrição                                   |
|-------------|---------|---------------------------------------------|
| id          | INTEGER | Chave primária, auto-incremento             |
| workout_id  | INTEGER | Chave estrangeira para a tabela `workouts`  |
| exercise_id | INTEGER | Chave estrangeira para a tabela `exercises` |
| reps        | INTEGER | Número de repetições realizadas             |
| weight      | REAL    | Peso utilizado (em kg)                      |
| weight_unit | TEXT    | Unidade de peso (ex: 'kg', 'plates')        |

**Tabela `workout_logs`**
| Coluna          | Tipo    | Descrição                                   |
|-----------------|---------|---------------------------------------------|
| id              | INTEGER | Chave primária, auto-incremento             |
| workout_id      | INTEGER | Chave estrangeira para a tabela `workouts`  |
| completed_at    | TEXT    | Data e hora de conclusão do treino (ISO 8601) |
| workout_details | TEXT    | Detalhes completos do treino em formato JSON |
| duration        | INTEGER | Duração do treino em segundos               |

## 🚀 Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Inicie o projeto (use `--tunnel` se o celular não estiver na mesma rede Wi-Fi):
```bash
npx expo start
```

**Importante:** Durante o desenvolvimento, o banco de dados é limpo e populado com dados padrão a cada inicialização (`await clearDatabase(database);` em `app/index.tsx`). Para builds de produção, **remova ou comente esta linha** para preservar os dados do usuário.

3. Use o aplicativo Expo Go no seu dispositivo para escanear o QR Code.

## 📝 Próximos Passos

- [ ] Refatoração de código:
  - [ ] Centralizar tipos duplicados em /src/types/models.ts
  - [ ] Criar hooks customizados para lógica reutilizável
- [ ] Tracking de progresso:
  - [ ] Histórico de peso/repetições
  - [ ] Gráficos de evolução
  - [ ] Recordes pessoais
- [ ] Adicionar mais exercícios ao catálogo
- [ ] Melhorias nas anotações:
  - [ ] Links para vídeos
- [ ] Backup e sincronização:
  - [ ] Exportar/importar dados
  - [ ] Backup na nuvem
  - [ ] Sincronização entre dispositivos

## 👨‍💻 Desenvolvimento

Este projeto foi desenvolvido usando boas práticas de programação:

- Código tipado com TypeScript (strict mode)
- Componentização e componentes reutilizáveis
- Hooks personalizados
- Gerenciamento de estado
- Tratamento de erros e validação de dados
- Feedback ao usuário claro e específico
- Persistência de dados offline-first
- Tratamento de permissões (câmera/galeria)

## 🔄 Changelog Recente

### 17/11/2024 - Correções, Validações, UX e Performance
- ✅ **Corrigido:** Inconsistência entre propriedade 'type' e 'category' nos treinos
  - Padronizado uso de 'category' em toda a aplicação
  - Removidos tipos locais duplicados em favor de tipos canônicos

- ✅ **Adicionado:** Validação robusta de inputs
  - Bloqueio de valores negativos em repetições e peso (tempo real)
  - Validação pré-salvamento de integridade de dados
  - Suporte a valores decimais em peso (ex: 22.5 kg)
  - Mensagens de erro específicas por tipo de validação

- ✅ **Adicionado:** Proteção contra perda de dados durante treino
  - Alerta de confirmação ao clicar em "Voltar" durante treino ativo
  - Interceptação do botão voltar do hardware (Android)
  - Previne perda acidental de progresso do treino

- ✅ **Adicionado:** Toast Notifications (UX Moderna)
  - Substituição de Alerts por toasts em feedbacks informativos
  - Notificações não intrusivas que desaparecem automaticamente
  - Mantém Alerts apenas para confirmações críticas (excluir, sair)
  - Experiência mais fluida sem interrupções

- ✅ **Otimizado:** Performance e renderização
  - SetRow memoizado com React.memo e comparação customizada
  - Componente Timer isolado para evitar re-renders desnecessários
  - useCallback em todas as funções do StartWorkoutScreen
  - Redução drástica de re-renderizações durante treino ativo
  - App mais fluido especialmente em treinos longos

- ✅ **Melhorado:** Consistência de tipos TypeScript
  - Importação de tipos canônicos de `storage.ts`
  - Melhor inferência de tipos em componentes