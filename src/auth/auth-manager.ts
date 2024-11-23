import * as vscode from 'vscode';

export class AuthManager {
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    async initialize(): Promise<void> {
        const apiKey = vscode.workspace.getConfiguration('javadevllm').get('apiKey');
        
        if (!apiKey) {
            const key = await this.promptForApiKey();
            if (key) {
                await this.saveApiKey(key);
            }
        }
    }

    private async promptForApiKey(): Promise<string | undefined> {
        return vscode.window.showInputBox({
            prompt: 'Enter your JavaDevLLM API key',
            password: true,
            ignoreFocusOut: true
        });
    }

    private async saveApiKey(apiKey: string): Promise<void> {
        await vscode.workspace.getConfiguration('javadevllm').update('apiKey', apiKey, true);
    }
}