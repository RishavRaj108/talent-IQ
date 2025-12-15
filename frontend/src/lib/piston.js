// Piston API is a service for code execution, this is the base URL.
const PISTON_API = "https://emkc.org/api/v2/piston";

// Configuration for supported programming languages and their versions
// used by the Piston API.
const LANGUAGE_VERSIONS = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
};

/**
 * Executes a block of source code using the Piston API.
 * @param {string} language - programming language (e.g., 'javascript', 'python').
 * @param {string} code - source code to be executed.
 * @returns {Promise<{success:boolean, output?:string, error?: string}>} 
 * An object indicating success and containing the output or error message.
 */
export async function executeCode(language, code) {
  try {
    // 1. Check for language support
    const languageConfig = LANGUAGE_VERSIONS[language];

    if (!languageConfig) {
      // Return an error if the language is not configured
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    // 2. Prepare and send the API request to Piston's /execute endpoint
    const response = await fetch(`${PISTON_API}/execute`, {
      method: "POST", // Use POST method for code execution
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: languageConfig.language,
        version: languageConfig.version,
        files: [
          {
            // Piston requires a file object with content and a name.
            name: `main.${getFileExtension(language)}`,
            content: code,
          },
        ],
      }),
    });

    // 3. Handle non-successful HTTP responses (e.g., 404, 500)
    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error! status: ${response.status}`,
      };
    }

    // 4. Parse the JSON response body
    const data = await response.json();

    // 5. Extract output and standard error (stderr)
    // The actual execution result is nested under the 'run' property.
    const output = data.run.output || "";
    const stderr = data.run.stderr || "";

    // 6. Check for compilation or runtime errors (stderr)
    if (stderr) {
      // Code failed to execute successfully
      return {
        success: false,
        output: output, // Include any partial output before the error
        error: stderr,
      };
    }

    // 7. Successful execution
    return {
      success: true,
      // Use "No output" if the output is empty string
      output: output || "No output", 
    };
  } catch (error) {
    // 8. Handle network or other unexpected errors (e.g., failed fetch)
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
    };
  }
}

/**
 * Helper function to determine the file extension based on the language name.
 * * @param {string} language - programming language.
 * @returns {string} The appropriate file extension.
 */
function getFileExtension(language) {
  const extensions = {
    javascript: "js",
    python: "py",
    java: "java",
  };

  // Return the specific extension or 'txt' as a fallback
  return extensions[language] || "txt";
}
