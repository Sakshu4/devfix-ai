package com.devfix.controller;

import com.devfix.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AIController — exposes the Gemini AI diagnosis to the frontend.
 * Public endpoint: no auth required (anyone can ask for a diagnosis).
 */
@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private GeminiService geminiService;

    /**
     * POST /api/ai/diagnose
     * Body: { "errorText": "your error message here" }
     * Returns: { "answer": "Gemini response..." }
     */
    @PostMapping("/diagnose")
    public ResponseEntity<?> diagnose(@RequestBody Map<String, String> body) {
        String errorText = body.getOrDefault("errorText", "").trim();

        if (errorText.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "errorText is required"));
        }
        if (errorText.length() > 4000) {
            errorText = errorText.substring(0, 4000);
        }

        try {
            String answer = geminiService.diagnose(errorText);
            return ResponseEntity.ok(Map.of("answer", answer));
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null && msg.startsWith("INVALID_KEY:")) {
                return ResponseEntity.status(401).body(Map.of("error", "Gemini API key is invalid. Contact the admin."));
            }
            return ResponseEntity.status(503).body(Map.of("error", "AI service unavailable. Please try again later."));
        }
    }
}
