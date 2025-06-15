
import { Node, Connection, AIInsight } from "@/types/canvas";

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface NetworkAnalysis {
  insights: AIInsight[];
  suggestions: string[];
  patterns: string[];
  optimizations: string[];
}

export class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  private model = 'gemini-2.0-flash-exp';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(prompt: string): Promise<string> {
    const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API request failed:', error);
      throw error;
    }
  }

  async analyzeNetwork(nodes: Node[], connections: Connection[]): Promise<NetworkAnalysis> {
    if (nodes.length === 0) {
      return { insights: [], suggestions: [], patterns: [], optimizations: [] };
    }

    const networkData = {
      nodeCount: nodes.length,
      connectionCount: connections.length,
      nodes: nodes.map(node => ({
        id: node.id,
        content: node.content,
        type: node.type,
        createdAt: node.createdAt.toISOString(),
      })),
      connections: connections.map(conn => ({
        from: nodes.find(n => n.id === conn.fromNodeId)?.content || 'Unknown',
        to: nodes.find(n => n.id === conn.toNodeId)?.content || 'Unknown',
        strength: conn.strength,
      })),
    };

    const prompt = `Analyze this neural network of thoughts and ideas. Provide insights in JSON format with the following structure:

{
  "insights": [
    {
      "type": "pattern|suggestion|optimization|creative",
      "title": "Brief title",
      "description": "Detailed insight description",
      "confidence": 0.85,
      "actionable": true,
      "priority": "low|medium|high"
    }
  ],
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2"],
  "patterns": ["pattern observation 1", "pattern observation 2"],
  "optimizations": ["optimization recommendation 1", "optimization recommendation 2"]
}

Network Data:
- ${networkData.nodeCount} nodes (thoughts/ideas)
- ${networkData.connectionCount} connections (relationships)
- Node contents: ${networkData.nodes.map(n => `"${n.content}"`).join(', ')}
- Connections: ${networkData.connections.map(c => `"${c.from}" ↔ "${c.to}"`).join(', ')}

Focus on:
1. Conceptual relationships and knowledge gaps
2. Network topology and connection density
3. Creative synthesis opportunities
4. Knowledge organization improvements
5. Emerging themes and patterns

Provide 3-5 meaningful insights that would help expand and improve this knowledge network.`;

    try {
      const response = await this.makeRequest(prompt);
      
      // Extract JSON from response (handle potential markdown formatting)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const analysis = JSON.parse(jsonMatch[0]);
      
      // Transform to our AIInsight format
      const insights: AIInsight[] = analysis.insights?.map((insight: any, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        type: insight.type || 'suggestion',
        title: insight.title || 'AI Insight',
        description: insight.description || 'No description available',
        confidence: insight.confidence || 0.7,
        actionable: insight.actionable !== false,
        priority: insight.priority || 'medium',
        createdAt: new Date(),
      })) || [];

      return {
        insights,
        suggestions: analysis.suggestions || [],
        patterns: analysis.patterns || [],
        optimizations: analysis.optimizations || [],
      };
    } catch (error) {
      console.error('Failed to analyze network:', error);
      // Return fallback insights on error
      return {
        insights: [{
          id: `fallback-${Date.now()}`,
          type: 'suggestion',
          title: 'AI Analysis Unavailable',
          description: 'Unable to connect to AI service. Check your internet connection and try again.',
          confidence: 1.0,
          actionable: false,
          priority: 'low',
          createdAt: new Date(),
        }],
        suggestions: ['Try refreshing the AI insights when connectivity is restored'],
        patterns: [],
        optimizations: [],
      };
    }
  }

  async generateContentSuggestions(existingContent: string, networkContext: Node[]): Promise<string[]> {
    const contextNodes = networkContext.slice(0, 5).map(n => n.content);
    
    const prompt = `Given this thought: "${existingContent}"
    And related thoughts in the network: [${contextNodes.join(', ')}]
    
    Suggest 3-5 ways to expand, refine, or connect this thought. Be creative and insightful.
    Return as a simple array of strings, one suggestion per line.`;

    try {
      const response = await this.makeRequest(prompt);
      return response.split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^[-*•]\s*/, '').trim())
        .slice(0, 5);
    } catch (error) {
      console.error('Failed to generate content suggestions:', error);
      return ['Consider expanding this thought with more detail', 'What examples support this idea?'];
    }
  }

  async suggestConnections(nodes: Node[], connections: Connection[]): Promise<Array<{from: string, to: string, reason: string}>> {
    if (nodes.length < 2) return [];

    const unconnectedPairs = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const existing = connections.find(c => 
          (c.fromNodeId === nodes[i].id && c.toNodeId === nodes[j].id) ||
          (c.fromNodeId === nodes[j].id && c.toNodeId === nodes[i].id)
        );
        if (!existing) {
          unconnectedPairs.push([nodes[i], nodes[j]]);
        }
      }
    }

    if (unconnectedPairs.length === 0) return [];

    const samplePairs = unconnectedPairs.slice(0, 5);
    const prompt = `Analyze these thought pairs and suggest which ones should be connected and why:

${samplePairs.map(([a, b], i) => `${i + 1}. "${a.content}" <-> "${b.content}"`).join('\n')}

For each pair that should be connected, respond with:
Connection: "thought1" -> "thought2"
Reason: Brief explanation of the relationship

Only suggest meaningful connections, not forced ones.`;

    try {
      const response = await this.makeRequest(prompt);
      const suggestions = [];
      const lines = response.split('\n');
      
      for (let i = 0; i < lines.length - 1; i++) {
        const connectionLine = lines[i];
        const reasonLine = lines[i + 1];
        
        if (connectionLine.includes('Connection:') && reasonLine.includes('Reason:')) {
          const connection = connectionLine.replace('Connection:', '').trim();
          const reason = reasonLine.replace('Reason:', '').trim();
          
          const match = connection.match(/"([^"]+)"\s*->\s*"([^"]+)"/);
          if (match) {
            suggestions.push({
              from: match[1],
              to: match[2],
              reason: reason
            });
          }
        }
      }
      
      return suggestions.slice(0, 3);
    } catch (error) {
      console.error('Failed to suggest connections:', error);
      return [];
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService('AIzaSyDCQflwwKTBUhHdaU5gqk3KN3YqKUjTKZI');
