# Plano de Negócio - AppTreino

## Visão Geral
**Objetivo**: Vender o aplicativo para personal trainers da cidade, oferecendo uma solução completa de gerenciamento de treinos para seus clientes.

**Status Atual**: MVP funcional com funcionalidades core implementadas (gerenciamento de treinos, exercícios, timer de descanso, modo escuro/claro).

---

## 1. Modelos de Negócio

### Opção A: White Label (Recomendado para Início)
- **Descrição**: Um app personalizado para cada personal trainer
- **Vantagens**:
  - Maior valor percebido pelo PT
  - Branding personalizado (logo, cores, nome)
  - PT pode cobrar mais dos clientes dele
  - Menos complexidade inicial
- **Desvantagens**:
  - Mais trabalho manual por cliente
  - Dificulta atualizações em massa
- **Precificação Sugerida**: R$ 500-1500 setup + R$ 50-150/mês

### Opção B: Multi-tenant SaaS
- **Descrição**: Um único app usado por múltiplos PTs e seus clientes
- **Vantagens**:
  - Escala melhor
  - Atualizações centralizadas
  - Menor custo operacional
- **Desvantagens**:
  - Requer infraestrutura mais complexa
  - Menor diferenciação para cada PT
- **Precificação Sugerida**: R$ 30-100/mês por PT

---

## 2. Roadmap de Desenvolvimento

### Fase 1: MVP Atual (Concluído ✓)
- [x] CRUD de treinos
- [x] CRUD de exercícios
- [x] Execução de treino com timer
- [x] Notificações de descanso (visual + vibração + som)
- [x] Modo escuro/claro
- [x] Tempo de descanso configurável
- [x] Armazenamento local (SQLite)
- [x] Funciona 100% offline

### Fase 2: Preparação para Venda (1-2 meses)
- [ ] Build APK para Android (gratuito via EAS)
- [ ] Build iOS via TestFlight (requer Apple Developer - $99/ano)
- [ ] Histórico de treinos realizados
- [ ] Gráficos de progresso básicos
- [ ] Exportar dados (PDF ou compartilhamento)
- [ ] Onboarding/tutorial para novos usuários
- [ ] Melhorias de UI/UX baseadas em feedback dos testadores atuais

### Fase 3: Funcionalidades Premium (2-4 meses)
- [ ] Sistema multi-usuário (PT pode criar treinos para múltiplos alunos)
- [ ] Sincronização na nuvem (Firebase/Supabase)
- [ ] Vídeos/imagens dos exercícios
- [ ] Calendário de treinos
- [ ] Sistema de progressão automática
- [ ] Biblioteca de exercícios mais completa
- [ ] Chat PT-Aluno (opcional)
- [ ] Painel administrativo web para o PT

---

## 3. Estratégia de Go-to-Market

### Passo 1: Validação com Beta Testers (Atual)
- Continuar testando com amigos e colegas
- Coletar feedback ativo
- Identificar 2-3 personal trainers para teste piloto gratuito
- Documentar casos de sucesso

### Passo 2: Primeiros Clientes Pagantes (2-3 meses)
- **Target**: 3-5 personal trainers locais
- **Abordagem**:
  - Demo presencial de 15-20 minutos
  - Mostrar diferencial: app personalizado para o negócio deles
  - Oferta de lançamento: 50% desconto nos primeiros 3 meses
  - Garantia de 30 dias (devolução se não gostar)
- **Materiais necessários**:
  - Apresentação/pitch deck
  - Vídeo demo do app
  - Casos de uso (antes/depois)
  - Planos e preços definidos

### Passo 3: Escala Local (6-12 meses)
- Rede de indicações (cashback para quem indicar)
- Presença em eventos fitness locais
- Parcerias com academias
- Marketing digital local (Instagram, Facebook)
- Depoimentos em vídeo dos primeiros clientes

---

## 4. Modelos de Precificação

### Modelo 1: Assinatura Mensal Simples
- **Básico**: R$ 49/mês - até 10 alunos
- **Profissional**: R$ 99/mês - até 30 alunos
- **Premium**: R$ 199/mês - alunos ilimitados + features avançadas

### Modelo 2: Por Aluno
- R$ 5-10 por aluno/mês
- Mínimo de R$ 50/mês
- PT repassa o custo para o aluno ou absorve

### Modelo 3: Licença Perpétua + Manutenção
- Setup único: R$ 800-1500
- Manutenção opcional: R$ 50/mês (updates e suporte)

### Modelo 4: White Label Completo
- R$ 2000-5000 setup inicial
- Inclui: personalização completa, publicação nas stores
- R$ 100-200/mês para hospedagem e manutenção

**Recomendação Inicial**: Modelo 1 (Assinatura Mensal) - mais previsível e aceito pelo mercado.

---

## 5. Estrutura de Custos

### Custos Atuais (Desenvolvimento)
- Tempo de desenvolvimento: variável
- Apple Developer (se for iOS): $99/ano (~R$ 500)
- Domínio (futuro): ~R$ 40/ano
- **Total anual atual**: R$ 500-600

### Custos Futuros (Operação)
- Hospedagem Firebase/Supabase: R$ 0-200/mês (depende da escala)
- Google Play Console (one-time): $25 (~R$ 125)
- Apple Developer: $99/ano (~R$ 500)
- Ferramentas (analytics, crash reporting): R$ 0-100/mês
- Suporte/manutenção: tempo próprio
- **Total mensal estimado**: R$ 100-400 (inicialmente)

---

## 6. Projeção de Receita (12 meses)

### Cenário Conservador
- Mês 1-3: 0 clientes (desenvolvimento)
- Mês 4-6: 3 clientes × R$ 99 = R$ 297/mês
- Mês 7-9: 8 clientes × R$ 99 = R$ 792/mês
- Mês 10-12: 15 clientes × R$ 99 = R$ 1.485/mês
- **Total ano 1**: ~R$ 8.000

### Cenário Otimista
- Mês 1-3: 2 clientes × R$ 99 = R$ 198/mês
- Mês 4-6: 10 clientes × R$ 99 = R$ 990/mês
- Mês 7-9: 20 clientes × R$ 99 = R$ 1.980/mês
- Mês 10-12: 35 clientes × R$ 99 = R$ 3.465/mês
- **Total ano 1**: ~R$ 22.000

---

## 7. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| PTs não querem pagar | Média | Alto | Período trial gratuito, demonstrar ROI |
| Competição (apps existentes) | Alta | Médio | Diferenciação: suporte local, personalização |
| Problemas técnicos/bugs | Média | Alto | Beta testing robusto, suporte rápido |
| Dificuldade em escalar | Baixa | Médio | Arquitetura cloud-first, automação |
| Custos > Receita inicial | Alta | Médio | Começar pequeno, crescimento orgânico |
| Churn (cancelamentos) | Média | Alto | Onboarding excelente, suporte proativo |

---

## 8. Métricas de Sucesso (KPIs)

### Mês 1-3 (Validação)
- 10+ beta testers ativos
- NPS > 8/10
- 2-3 PTs concordam em testar gratuitamente

### Mês 4-6 (Tração Inicial)
- 3-5 clientes pagantes
- Churn < 20%
- Feedback positivo documentado

### Mês 7-12 (Crescimento)
- 15+ clientes pagantes
- MRR (receita mensal recorrente) > R$ 1.500
- 1-2 indicações orgânicas por mês
- Tempo de onboarding < 30 minutos

---

## 9. Próximos Passos Imediatos

### Semana 1-2: Distribuição Facilitada
- [x] Criar APK para Android (EAS Build - gratuito)
- [ ] Configurar TestFlight para iOS (se viável financeiramente)
- [ ] Documentar processo de instalação simplificado
- [ ] Enviar APK/TestFlight para beta testers atuais

### Semana 3-4: Coleta de Feedback
- [ ] Criar formulário de feedback estruturado
- [ ] Entrevistas 1-on-1 com 5+ usuários
- [ ] Identificar top 3 melhorias necessárias
- [ ] Priorizar roadmap baseado em feedback

### Mês 2: Preparação para Pitch
- [ ] Criar apresentação de vendas
- [ ] Gravar vídeo demo de 3-5 minutos
- [ ] Definir preços finais
- [ ] Identificar 5-10 PTs para abordar
- [ ] Preparar materiais de marketing (prints, features list)

### Mês 3: Primeiras Vendas
- [ ] Agendar 5 demos presenciais
- [ ] Oferta de lançamento definida
- [ ] Processo de onboarding documentado
- [ ] Sistema de suporte básico (WhatsApp/Email)
- [ ] Fechar 1º cliente pagante

---

## 10. Perguntas Estratégicas a Responder

1. **Foco Geográfico**: Apenas sua cidade inicialmente ou expandir para região?
2. **Nicho**: Todos os PTs ou focar em um nicho específico (crossfit, bodybuilding, etc)?
3. **Envolvimento**: Quer trabalhar nisso full-time eventualmente ou manter como side project?
4. **Parceria**: Considera trazer um PT como co-founder/advisor?
5. **Investimento**: Quanto está disposto a investir inicialmente? (tempo e dinheiro)
6. **Tecnologia**: Confortável em gerenciar infraestrutura cloud ou prefere manter simples/local?

---

## Recursos Úteis

### Desenvolvimento
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **Firebase**: https://firebase.google.com/docs/guides
- **Supabase**: https://supabase.com/docs

### Negócios
- **Calculadora de SaaS Metrics**: https://www.forentrepreneurs.com/saas-metrics-2/
- **Pricing Strategy**: https://www.priceintelligently.com/

### Marketing
- **Landing Page**: Hostinger, Vercel, Netlify
- **Email Marketing**: Mailchimp (free tier)
- **Analytics**: Google Analytics, Mixpanel

---

**Última Atualização**: 2025-11-17
**Versão**: 1.0
