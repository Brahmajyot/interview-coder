export const PISTON_API_URL = "https://emkc.org/api/v2/piston";

export const executeCode = async (language, sourceCode) => {
  const response = await fetch(PISTON_API_URL + "/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: language,
      version: "*",
      files: [{ content: sourceCode }],
    }),
  });

  const data = await response.json();
  return data;
};

export const CODE_SNIPPETS = {
  javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Interviewer");\n`,
  python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Interviewer")\n`,
};