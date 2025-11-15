# Gemini Interaction Guidelines

This document outlines how the Gemini model should interact with this project, leveraging existing patterns and configurations.

## Core Gemini Usage

The project utilizes Gemini for various LLM-related tasks, including:
-   **General LLM Calls**: Handled by the `GeminiModel` class, which includes retry mechanisms and parallel processing capabilities. When making LLM calls, prefer using the `call` or `call_parallel` methods of the `GeminiModel` class.
-   **Schema Conversion**: The project includes utilities for converting OpenAPI schemas to Gemini-compatible schemas (`_to_gemini_schema`) and vice-versa (`gemini_to_json_schema`). When working with tool definitions or structured outputs, ensure these conversion utilities are used consistently.
-   **Evaluation**: A custom evaluation configuration is defined in `setup_gemini_config`, which uses `google/gemini-2.0-flash-001` via OpenRouter for consistent evaluation.

## Model Configuration

-   **Default Model**: The `Gemini` class (inheriting from `BaseLlm`) defaults to `gemini-1.5-flash`.
-   **Supported Models**: Refer to `Gemini.supported_models()` for a list of patterns matching supported Gemini models and fine-tuned endpoints.
-   **API Backend**: The `_api_backend` property dynamically determines whether to use `VERTEX_AI` or `GEMINI_API`.

## Interaction Principles

-   **Adherence to Conventions**: Always adhere to existing project conventions, coding styles, and architectural patterns.
-   **Contextual Awareness**: Before making changes or generating code, thoroughly analyze surrounding code, tests, and configuration files.
-   **Testing**: When implementing new features or fixing bugs related to Gemini interactions, include appropriate unit and integration tests.
-   **Safety Settings**: LLM calls are configured with `SAFETY_FILTER_CONFIG`. Ensure any new interactions respect these settings.
-   **Error Handling**: Leverage the retry logic in `GeminiModel.call_parallel` for robust interactions with the Gemini API.

## Specific Instructions for Gemini

-   When asked to generate code that interacts with Gemini, prioritize using the `GeminiModel` class for making API calls.
-   When defining or modifying tool schemas, ensure they are compatible with the `_to_gemini_schema` and `gemini_to_json_schema` conversion logic.
-   For evaluation tasks, refer to the `setup_gemini_config` for the established model and provider.