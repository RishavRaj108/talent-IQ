const JUDGE0_API = "https://ce.judge0.com";

const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62
};

export async function executeCode(language, code) {
  try {
    const languageId = LANGUAGE_IDS[language];

    if (!languageId) {
      return { success: false, error: "Unsupported language" };
    }

    const response = await fetch(
      `${JUDGE0_API}/submissions?base64_encoded=false&wait=true`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          language_id: languageId,
          source_code: code
        })
      }
    );

    const result = await response.json();
    console.log(result);

    if (result.stderr) {
      return {
        success: false,
        error: result.stderr,
        output: result.stdout || ""
      };
    }

    return {
      success: true,
      output: result.stdout || "No output"
    };

  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}