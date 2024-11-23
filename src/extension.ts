import * as vscode from 'vscode';
import { LLMService } from './services/llm-service';
import { AuthManager } from './auth/auth-manager';

export function activate(context: vscode.ExtensionContext) {
    const llmService = new LLMService();
    const authManager = new AuthManager(context);

    // Register code generation command
    const generateCodeDisposable = vscode.commands.registerCommand('javadevllm.generateCode', async () => {
        try {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor found');
                return;
            }

            const selection = editor.selection;
            const text = editor.document.getText(selection);

            // Show loading indicator
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Generating code...",
                cancellable: false
            }, async (progress) => {
                const response = await llmService.generateCode(text);
                if (response) {
                    editor.edit(editBuilder => {
                        editBuilder.replace(selection, response);
                    });
                }
            });
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to generate code: ${error}`);
        }
    });

    // Register code explanation command
    const explainCodeDisposable = vscode.commands.registerCommand('javadevllm.explainCode', async () => {
        try {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor found');
                return;
            }

            const selection = editor.selection;
            const text = editor.document.getText(selection);

            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Analyzing code...",
                cancellable: false
            }, async (progress) => {
                const explanation = await llmService.explainCode(text);
                if (explanation) {
                    // Show explanation in a webview
                    const panel = vscode.window.createWebviewPanel(
                        'codeExplanation',
                        'Code Explanation',
                        vscode.ViewColumn.Beside,
                        {}
                    );
                    panel.webview.html = getWebviewContent(explanation);
                }
            });
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to explain code: ${error}`);
        }
    });

    context.subscriptions.push(generateCodeDisposable, explainCodeDisposable);
}

function getWebviewContent(explanation: string) {
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Code Explanation</title>
            </head>
            <body>
                <div style="padding: 20px;">
                    ${explanation}
                </div>
            </body>
        </html>
    `;
}

export function deactivate() {}