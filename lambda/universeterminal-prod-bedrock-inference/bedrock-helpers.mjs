import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const bedrock = new BedrockRuntimeClient({ region: "us-west-2" });

export async function generateContent(prompt, temperature) {
  try {
    const response = await bedrock.send(
      new InvokeModelCommand({
        modelId: "amazon.nova-micro-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          inputText: prompt,
          textGenerationConfig: {
            temperature,
            maxTokenCount: 300,
          },
        }),
      })
    );

    const result = JSON.parse(new TextDecoder().decode(response.body));
    return result.results[0].outputText.trim();
  } catch (error) {
    console.error("Bedrock error:", error);
    return "Error generating cosmic response.";
  }
}

export async function generateDirectoryContents(path, temperature) {
  const prompt = `Generate 3-5 items for directory: ${path}
  Return JSON array: [{"name": "item", "type": "dir|file", "description": "brief desc"}]`;

  const response = await generateContent(prompt, temperature);

  try {
    return JSON.parse(response);
  } catch {
    // Fallback
    return [
      { name: "data.txt", type: "file", description: "Cosmic data" },
      { name: "sector-7", type: "dir", description: "Unexplored region" },
    ];
  }
}

export async function generateFileContent(filePath, filename, temperature) {
  const pathParts = filePath.split("/").filter((p) => p.length > 0);
  const location = pathParts.join(" > ");

  const prompt = `You are generating content for a file in a cosmic exploration terminal.
  
  File: ${filename}
  Location: ${location}
  
  Generate realistic content (2-4 lines) that would be found in this file. Consider:
  - Scientific data, logs, or observations
  - Exploration reports or discoveries
  - Technical specifications or coordinates
  
  Be creative but keep it concise and space/astronomy themed.`;

  return await generateContent(prompt, temperature);
}
