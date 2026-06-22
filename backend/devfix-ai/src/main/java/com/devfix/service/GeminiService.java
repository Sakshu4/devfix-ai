package com.devfix.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * GeminiService — now rewritten to call OpenRouter API from the server side.
 * The API key is stored in application.properties, never exposed to the browser.
 */
@Service
public class GeminiService {

    @Value("${ai.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();



    /**
     * Diagnose a developer error using OpenRouter AI.
     * Retries once on 429 (rate limit) after a 3-second wait.
     */
    public String diagnose(String errorText) {
        String requestBody = buildRequestBody(SYSTEM_PROMPT, errorText);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        headers.set("HTTP-Referer", "http://localhost:5173");
        headers.set("X-Title", "DevFix AI");
        
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        int maxAttempts = 3;
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                ResponseEntity<Map> response = restTemplate.exchange(BASE_URL, HttpMethod.POST, entity, Map.class);
                return extractText(response.getBody());
            } catch (HttpClientErrorException e) {
                int status = e.getStatusCode().value();
                String body = e.getResponseBodyAsString();
                System.err.println("[GeminiService] Attempt " + attempt + " → HTTP " + status + " | " + body);

                if (status == 429) {
                    if (attempt < maxAttempts) {
                        System.err.println("[GeminiService] Rate limited — waiting 3s before retry...");
                        try { Thread.sleep(3000); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
                        continue;
                    }
                    throw new RuntimeException("RATE_LIMITED: AI is rate-limited. Please wait a moment and try again.");
                }
                // 400 / 401 / 403 — key problem
                throw new RuntimeException("AI_ERROR_" + status + ": " + body);
            } catch (Exception e) {
                System.err.println("[GeminiService] Attempt " + attempt + " failed: " + e.getMessage());
                if (attempt == maxAttempts) {
                    throw new RuntimeException("AI service unreachable: " + e.getMessage());
                }
            }
        }
        throw new RuntimeException("AI request failed after " + maxAttempts + " attempts.");
    }

    private static final String BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

    private static final String SYSTEM_PROMPT =
        "You are DevFix AI, an expert developer environment troubleshooter. " +
        "You specialize in Java, Spring Boot, Maven, Node.js, npm, Docker, Git, and PostgreSQL errors. " +
        "When given an error or log:\n" +
        "1. Identify the root cause in 1-2 sentences\n" +
        "2. Give numbered fix steps (be specific and practical, include commands where relevant)\n" +
        "3. Mention Windows/Linux/Mac differences if the fix varies by OS\n" +
        "4. Add a short prevention tip at the end\n" +
        "Format with bold section headers: **Root Cause**, **Fix Steps**, **Prevention Tip**\n" +
        "Keep the total response under 350 words. Be direct and helpful.";



    @SuppressWarnings("unchecked")
    private String extractText(Map<?, ?> body) {
        if (body == null) return "No response from AI.";
        var choices = (java.util.List<Map<?, ?>>) body.get("choices");
        if (choices == null || choices.isEmpty()) return "Empty response from AI.";
        var message = (Map<?, ?>) choices.get(0).get("message");
        if (message == null) return "No message content from AI.";
        return (String) message.get("content");
    }

    private String buildRequestBody(String systemPrompt, String userPrompt) {
        return """
            {
              "model": "openrouter/free",
              "messages": [
                { "role": "system", "content": %s },
                { "role": "user", "content": %s }
              ],
              "max_tokens": 512,
              "temperature": 0.4
            }
            """.formatted(toJsonString(systemPrompt), toJsonString(userPrompt));
    }

    private String toJsonString(String text) {
        // Escape the text safely for JSON
        return "\"" + text
            .replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
            .replace("\t", "\\t") + "\"";
    }
}
