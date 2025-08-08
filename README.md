# 🚀 Assistente Virtual Copilot - Power Platform

Componente PCF para autocompletar e-mails integrado com Power Apps e Dynamics 365.

## 🔧 Tecnologias
- Power Apps Component Framework (TypeScript)
- Power Platform CLI
- Microsoft Graph API (para sugestões de e-mail)

## 🏗️ Estrutura do Projeto
```
assistente-copilot-office/
├── power-apps/
│   └── components/
│       └── EmailAutoComplete/       # Componente PCF
│           ├── index.ts             # Lógica principal
│           ├── ControlManifest.xml  # Metadados
│           └── ...                  
├── docs/                           # Documentação
└── README.md                       # Este arquivo
```

## 🛠️ Como Desenvolver
1. **Edite o componente**:
   ```powershell
   cd power-apps/components/EmailAutoComplete
   code .
   ```

2. **Execute em modo desenvolvimento**:
   ```powershell
   npm start
   ```
   Acesse: `http://localhost:8181`

3. **Publicar no ambiente**:
   ```powershell
   pac pcf push --environment [ID] --publisher-prefix DGOFF
   ```

## 📦 Dependências
```powershell
npm install
```

## 🤝 Contribuição
1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença
[MIT](LICENSE)
