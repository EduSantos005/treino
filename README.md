# AppTreino

Um aplicativo móvel para registro e acompanhamento de treinos de academia, desenvolvido com React Native e Expo.

## 🏋️‍♂️ Funcionalidades

### Gerenciamento de Treinos
- ✅ Criar novos treinos a partir de um catálogo de exercícios
- ✅ Visualizar lista de treinos com categoria e quantidade de exercícios
- ✅ Editar treinos existentes
- ✅ Excluir treinos
- ✅ Armazenamento local persistente
- ✅ **Imagens de Exercícios:** As imagens dos exercícios são salvas e exibidas corretamente nas telas de treino e execução.

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

### Histórico de Treinos
- ✅ Registro detalhado de treinos concluídos, incluindo exercícios, séries, repetições e pesos.
- ✅ Visualização do histórico em um calendário interativo.
- ✅ Armazenamento persistente no banco de dados SQLite.

### Interface e Usabilidade
- ✅ Design moderno e intuitivo
- ✅ Navegação fluida entre campos com o teclado (botão "Next")
- ✅ Ajuste automático da tela para o teclado não cobrir os campos
- ✅ Validação de dados e mensagens de feedback claras
- ✅ Suporte a gestos no carrossel de exercícios
- ✅ **Posicionamento de Títulos:** Ajuste fino no posicionamento dos títulos das telas para uma melhor estética e consistência.
- ✅ **Navegação Aprimorada:** Texto do atalho 'Biblioteca' alterado para 'Exercícios' para maior clareza.

## 🛠 Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento mobile
- **Expo**: Plataforma de desenvolvimento (SDK 50+)
- **React Navigation**: Sistema de navegação
- **Expo-SQLite**: Banco de dados local para persistência de dados offline-first.
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
| type   | TEXT    | Categoria do treino (ex: 'chest-triceps')       |

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

- Código tipado com TypeScript
- Componentização
- Hooks personalizados
- Gerenciamento de estado
- Tratamento de erros
- Feedback ao usuário
- Componentes reutilizáveis
- Persistência de dados
- Tratamento de permissões (câmera/galeria)