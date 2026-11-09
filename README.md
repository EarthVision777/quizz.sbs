# Llama Eterna

Questionário em espanhol, no formato de funil de tela cheia no celular e de um telefone no desktop. São as mesmas etapas do quiz de reconquista: motivo, tempo, contato, quem terminou, nomes, data, e o que dói agora. No fim sai uma leitura com os dois nomes, o padrão da história e o que fazer nesta semana.

As respostas ficam só neste navegador. Não há pagamento, contagem regressiva nem promessa de que alguém volte.

## Admin do checkout

Em `/admin` a senha configurada no app abre a tabela do card de pagamento. Dá para editar título, preços, lista, botão, link https e os segundos até o card aparecer. Sem link, o botão não cobra. A senha não é criada nessa página.

## Como usar

Toque em **Empieza ahora** e responda. O botão da esquerda volta um passo. O da direita liga e desliga o som do toque. Se a data ou o nome estiverem incompletos, o quiz avisa e não avança. **Empezar de nuevo** apaga o rascunho.

## Como rodar

```bash
npm install
npm run dev
```

O servidor de desenvolvimento sobe na porta **4317**.
