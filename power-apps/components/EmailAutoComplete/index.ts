import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class EmailAutoComplete implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    // Elementos do DOM
    private _container: HTMLDivElement;
    private _inputElement: HTMLInputElement;
    private _suggestionsContainer: HTMLDivElement;

    // Contexto e callbacks
    private _context: ComponentFramework.Context<IInputs>;
    private _notifyOutputChanged: () => void;

    // Estado
    private _selectedDomain: string = "";
    private _userInput: string = "";

    constructor() { }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;
        this._container = container;

        // Criar elemento de input
        this._inputElement = document.createElement("input");
        this._inputElement.type = "text";
        this._inputElement.placeholder = "Digite seu e-mail";
        this._inputElement.addEventListener("input", this.handleInputChange.bind(this));
        this._inputElement.addEventListener("blur", this.handleInputBlur.bind(this));

        // Container de sugestões
        this._suggestionsContainer = document.createElement("div");
        this._suggestionsContainer.className = "email-suggestions";
        this._suggestionsContainer.style.display = "none";

        // Adicionar ao DOM
        this._container.appendChild(this._inputElement);
        this._container.appendChild(this._suggestionsContainer);

        // Aplicar estilos
        this.applyStyles();
    }

    private applyStyles(): void {
        const style = document.createElement("style");
        style.textContent = `
            .email-suggestions {
                position: absolute;
                border: 1px solid #d4d4d4;
                border-top: none;
                z-index: 99;
                width: calc(100% - 2px);
                background-color: white;
            }
            .email-suggestion-item {
                padding: 8px;
                cursor: pointer;
            }
            .email-suggestion-item:hover {
                background-color: #f0f0f0;
            }
            input {
                width: 100%;
                padding: 8px;
                font-size: 14px;
                box-sizing: border-box;
            }
        `;
        this._container.appendChild(style);
    }

    private handleInputChange(event: Event): void {
        const input = (event.target as HTMLInputElement).value;
        this._userInput = input;

        // Verificar se o usuário digitou '@'
        if (input.includes("@")) {
            const [prefix] = input.split("@");
            this.showDomainSuggestions(prefix);
        } else {
            this._suggestionsContainer.style.display = "none";
        }

        this._notifyOutputChanged();
    }

    private handleInputBlur(): void {
        setTimeout(() => {
            this._suggestionsContainer.style.display = "none";
        }, 200);
    }

    private showDomainSuggestions(prefix: string): void {
        // Limpar sugestões anteriores
        this._suggestionsContainer.innerHTML = "";

        // Obter domínios permitidos do contexto
        const allowedDomainsRaw = this._context.parameters.allowedDomains.raw || "";
        const allowedDomains = allowedDomainsRaw.split(";").map(domain => domain.trim()).filter(Boolean);
        const defaultDomain = this._context.parameters.defaultDomain.raw || "@pucminas.br";

        // Adicionar domínio padrão primeiro
        if (defaultDomain) {
            this.addSuggestionItem(`${prefix}${defaultDomain}`);
        }

        // Adicionar outros domínios permitidos
        allowedDomains.forEach((domain: string) => {
            if (domain !== defaultDomain) {
                this.addSuggestionItem(`${prefix}${domain}`);
            }
        });

        // Mostrar container se houver sugestões
        if (this._suggestionsContainer.children.length > 0) {
            this._suggestionsContainer.style.display = "block";
        }
    }

    private addSuggestionItem(email: string): void {
        const item = document.createElement("div");
        item.className = "email-suggestion-item";
        item.textContent = email;

        item.addEventListener("click", () => {
            this._inputElement.value = email;
            this._selectedDomain = email.split("@")[1];
            this._suggestionsContainer.style.display = "none";
            this._notifyOutputChanged();
        });

        this._suggestionsContainer.appendChild(item);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Atualizar o valor se foi alterado externamente
        if (context.parameters.userQuery.raw !== this._inputElement.value) {
            this._inputElement.value = context.parameters.userQuery.raw || "";
        }

        // Atualizar domínios permitidos se necessário
        this._context = context;
    }

    public getOutputs(): IOutputs {
        return {
            userQuery: this._inputElement.value
        };
    }

    public destroy(): void {
        // Limpar event listeners
        this._inputElement.removeEventListener("input", this.handleInputChange);
        this._inputElement.removeEventListener("blur", this.handleInputBlur);
    }
}