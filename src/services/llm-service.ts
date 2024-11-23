import axios from 'axios';
import * as vscode from 'vscode';

export class LLMService {
    private readonly apiKey: string;
    private readonly baseUrl: string;

    constructor() {
        this.apiKey = vscode.workspace.getConfiguration('javadevllm').get('apiKey') || '';
        this.baseUrl = 'YOUR_API_ENDPOINT'; // Replace with actual API endpoint
    }

    async generateCode(prompt: string): Promise<string> {
        try {
            const response = await axios.post(`${this.baseUrl}/generate`, {
                prompt,
                language: 'java'
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.code;
        } catch (error) {
            console.error('Error generating code:', error);
            throw new Error('Failed to generate code');
        }
    }

    async explainCode(code: string): Promise<string> {
        try {
            const response = await axios.post(`${this.baseUrl}/explain`, {
                code,
                language: 'java'
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.explanation;
        } catch (error) {
            console.error('Error explaining code:', error);
            throw new Error('Failed to explain code');
        }
    }
}