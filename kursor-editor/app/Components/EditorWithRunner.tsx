"use client";
import dynamic from "next/dynamic";
// Dynamically import Monaco to cut initial bundle
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Split from "react-split";
import { Settings } from "lucide-react";
import Tooltip from "@mui/material/Tooltip";

const languageMap: Record<string, number> = {
  javascript: 93,
  python: 71,
  cpp: 54,
  java: 62, // Judge0: Java (OpenJDK)
  typescript: 74, // TypeScript
  csharp: 51, // C#
  php: 68, // PHP
  ruby: 72, // Ruby
  go: 60, // Go
  rust: 73, // Rust
  kotlin: 78, // Kotlin
  swift: 83, // Swift
  dart: 90, // Dart
  scala: 81, // Scala
};

const codeTemplates: Record<string, string> = {
  javascript: `console.log("Hello World")`,
  python: `print("Hello World")`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World" << endl;
    return 0;
}`,
  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Example: read one line from stdin
        String line = sc.hasNextLine() ? sc.nextLine() : "";
        System.out.println("Hello World" + (line.isEmpty() ? "" : ", " + line));
        sc.close();
    }
}`,
  typescript: `console.log("Hello World");

// TypeScript example with types
interface Greeting {
    message: string;
    name?: string;
}

const greeting: Greeting = {
    message: "Hello World"
};

console.log(greeting.message);`,
  csharp: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello World");
        
        // Example with input
        Console.Write("Enter your name: ");
        string name = Console.ReadLine();
        if (!string.IsNullOrEmpty(name))
        {
            Console.WriteLine($"Hello, {name}!");
        }
    }
}`,
  php: `<?php
echo "Hello World\\n";

// Example with variables
$name = "World";
echo "Hello, " . $name . "!\\n";

// Example with function
function greet($name = "World") {
    return "Hello, " . $name . "!";
}

echo greet();
?>`,
  ruby: `puts "Hello World"

# Example with variables
name = "World"
puts "Hello, #{name}!"

# Example with method
def greet(name = "World")
  "Hello, #{name}!"
end

puts greet`,
  go: `package main

import "fmt"

func main() {
    fmt.Println("Hello World")
    
    // Example with variables
    name := "World"
    fmt.Printf("Hello, %s!\\n", name)
}`,
  rust: `fn main() {
    println!("Hello World");
    
    // Example with variables
    let name = "World";
    println!("Hello, {}!", name);
    
    // Example with function
    greet("Rust");
}

fn greet(name: &str) {
    println!("Hello, {}!", name);
}`,
  kotlin: `fun main() {
    println("Hello World")
    
    // Example with variables
    val name = "World"
    println("Hello, $name!")
    
    // Example with function
    greet("Kotlin")
}

fun greet(name: String) {
    println("Hello, $name!")
}`,
  swift: `import Foundation

print("Hello World")

// Example with variables
let name = "World"
print("Hello, \\(name)!")

// Example with function
func greet(_ name: String = "World") {
    print("Hello, \\(name)!")
}

greet("Swift")`,
  dart: `void main() {
  print('Hello World');
  
  // Example with variables
  String name = 'World';
  print('Hello, $name!');
  
  // Example with function
  greet('Dart');
}

void greet(String name) {
  print('Hello, $name!');
}`,
  scala: `object Main {
  def main(args: Array[String]): Unit = {
    println("Hello World")
    
    // Example with variables
    val name = "World"
    println(s"Hello, $name!")
    
    // Example with function
    greet("Scala")
  }
  
  def greet(name: String): Unit = {
    println(s"Hello, $name!")
  }
}`,
};

const themes = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "vs-dark" },
  { label: "Dracula", value: "dracula" },
  { label: "Monokai", value: "monokai" },
];
const fonts = [
  { label: "Fira Code", value: "Fira Code, monospace" },
  { label: "JetBrains Mono", value: "JetBrains Mono, monospace" },
  { label: "Source Code Pro", value: "Source Code Pro, monospace" },
];

type SavedCode = {
  id: string;
  userId: string;
  title: string;
  code: string;
  language: string;
  createdAt: string;
  updatedAt: string;
};

export default function EditorWithRunner() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user?.email;
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(codeTemplates["javascript"]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("Output will appear here...");
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [editorFont, setEditorFont] = useState("Fira Code, monospace");
  const [fontSize, setFontSize] = useState(14);
  const [tabWidth, setTabWidth] = useState(2);
  const [useTabs, setUseTabs] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [lineWrapping, setLineWrapping] = useState(true);
  const [autocomplete, setAutocomplete] = useState(true);
  const [linting, setLinting] = useState(true);
  const [savedSnippets, setSavedSnippets] = useState<SavedCode[]>([]);
  const [selectedSnippet, setSelectedSnippet] = useState<SavedCode | null>(
    null
  );
  const [showSnippets, setShowSnippets] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [snippetTitle, setSnippetTitle] = useState("");
  const [renameTitle, setRenameTitle] = useState("");
  const [snippetLoading, setSnippetLoading] = useState(false);
  // Lightweight toast
  const [toast, setToast] = useState<{
    msg: string;
    type?: "info" | "success" | "error";
  } | null>(null);
  const showToast = (
    msg: string,
    type: "info" | "success" | "error" = "info"
  ) => {
    setToast({ msg, type });
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(null), 3000);
  };
  const editorRef = useRef<any>(null);

  // Register custom themes with Monaco
  function handleEditorWillMount(monaco: any) {
    // Dracula theme
    monaco.editor.defineTheme("dracula", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { background: "282a36" },
        { token: "comment", foreground: "6272a4" },
        { token: "string", foreground: "f1fa8c" },
        { token: "number", foreground: "bd93f9" },
        { token: "keyword", foreground: "ff79c6" },
        { token: "operator", foreground: "ff79c6" },
        { token: "function", foreground: "50fa7b" },
        { token: "variable", foreground: "8be9fd" },
      ],
      colors: {
        "editor.background": "#282a36",
        "editor.foreground": "#f8f8f2",
        "editor.lineHighlightBackground": "#44475a",
        "editorCursor.foreground": "#f8f8f0",
        "editor.selectionBackground": "#44475a",
        "editor.inactiveSelectionBackground": "#44475a99",
      },
    });
    // Monokai theme
    monaco.editor.defineTheme("monokai", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { background: "272822" },
        { token: "comment", foreground: "75715e" },
        { token: "string", foreground: "e6db74" },
        { token: "number", foreground: "ae81ff" },
        { token: "keyword", foreground: "f92672" },
        { token: "operator", foreground: "f92672" },
        { token: "function", foreground: "a6e22e" },
        { token: "variable", foreground: "fd971f" },
      ],
      colors: {
        "editor.background": "#272822",
        "editor.foreground": "#f8f8f2",
        "editor.lineHighlightBackground": "#3e3d32",
        "editorCursor.foreground": "#f8f8f0",
        "editor.selectionBackground": "#49483e",
        "editor.inactiveSelectionBackground": "#49483e99",
      },
    });

    // Configure JS/TS IntelliSense in browser
    try {
      const ts = monaco.languages.typescript;
      const tsOptions = {
        target: ts.ScriptTarget.ES2021,
        allowJs: true,
        checkJs: true,
        jsx: ts.JsxEmit.ReactJSX,
        lib: ["es2021", "dom"],
        noEmit: true,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
      };
      ts.javascriptDefaults.setCompilerOptions(tsOptions);
      ts.typescriptDefaults.setCompilerOptions(tsOptions);
      ts.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });
      ts.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });
    } catch {}

    // Helper to compute completion range
    const getRange = (model: any, position: any) => {
      const word = model.getWordUntilPosition(position);
      return new monaco.Range(
        position.lineNumber,
        word.startColumn,
        position.lineNumber,
        word.endColumn
      );
    };

    // Register lightweight snippet completions for each language
    const S = monaco.languages.CompletionItemKind;
    const R = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;

    // JavaScript
    monaco.languages.registerCompletionItemProvider("javascript", {
      provideCompletionItems(model: any, position: any) {
        const range = getRange(model, position);
        return {
          suggestions: [
            {
              label: "log",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: "console.log(${1:msg});",
              documentation: "console.log",
              range,
            },
            {
              label: "fori",
              kind: S.Snippet,
              insertTextRules: R,
              insertText:
                "for (let i = 0; i < ${1:arr}.length; i++) {\n  const ${2:el} = ${1:arr}[i];\n  ${3}\n}",
              documentation: "for index loop",
              range,
            },
            {
              label: "asyncfn",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: "async function ${1:name}(${2:args}) {\n  ${3}\n}",
              documentation: "async function",
              range,
            },
            {
              label: "trycatch",
              kind: S.Snippet,
              insertTextRules: R,
              insertText:
                "try {\n  ${1}\n} catch (e) {\n  console.error(e);\n}",
              documentation: "try/catch",
              range,
            },
          ],
        };
      },
    });

    // Python
    monaco.languages.registerCompletionItemProvider("python", {
      provideCompletionItems(model: any, position: any) {
        const range = getRange(model, position);
        return {
          suggestions: [
            {
              label: "print",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: 'print(${1:"Hello World"})',
              documentation: "print",
              range,
            },
            {
              label: "def",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: "def ${1:name}(${2:args}):\n    ${3:pass}",
              documentation: "function",
              range,
            },
            {
              label: "fori",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: "for i in range(${1:n}):\n    ${2:pass}",
              documentation: "for loop",
              range,
            },
            {
              label: "ifmain",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: 'if __name__ == "__main__":\n    ${1:main()}',
              documentation: "entrypoint",
              range,
            },
          ],
        };
      },
    });

    // C++
    monaco.languages.registerCompletionItemProvider("cpp", {
      provideCompletionItems(model: any, position: any) {
        const range = getRange(model, position);
        return {
          suggestions: [
            {
              label: "main",
              kind: S.Snippet,
              insertTextRules: R,
              insertText:
                "#include <iostream>\nusing namespace std;\n\nint main() {\n    ${1:// code}\n    return 0;\n}",
              documentation: "main function",
              range,
            },
            {
              label: "cout",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: 'cout << ${1:"Hello"} << endl;',
              documentation: "cout",
              range,
            },
            {
              label: "fori",
              kind: S.Snippet,
              insertTextRules: R,
              insertText:
                "for (int i = 0; i < ${1:n}; ++i) {\n    ${2}// code\n}",
              documentation: "for loop",
              range,
            },
          ],
        };
      },
    });

    // Java
    monaco.languages.registerCompletionItemProvider("java", {
      provideCompletionItems(model: any, position: any) {
        const range = getRange(model, position);
        return {
          suggestions: [
            {
              label: "main",
              kind: S.Snippet,
              insertTextRules: R,
              insertText:
                "public class Main {\n    public static void main(String[] args) {\n        ${1:// code}\n    }\n}",
              documentation: "main class",
              range,
            },
            {
              label: "sout",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: 'System.out.println(${1:"Hello"});',
              documentation: "System.out.println",
              range,
            },
            {
              label: "fori",
              kind: S.Snippet,
              insertTextRules: R,
              insertText:
                "for (int i = 0; i < ${1:n}; i++) {\n    ${2}// code\n}",
              documentation: "for loop",
              range,
            },
          ],
        };
      },
    });

    // TypeScript
    monaco.languages.registerCompletionItemProvider("typescript", {
      provideCompletionItems(model: any, position: any) {
        const range = getRange(model, position);
        return {
          suggestions: [
            {
              label: "interface",
              kind: S.Snippet,
              insertTextRules: R,
              insertText:
                "interface ${1:Name} {\n    ${2:property}: ${3:type};\n}",
              documentation: "interface",
              range,
            },
            {
              label: "type",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: "type ${1:Name} = ${2:type};",
              documentation: "type alias",
              range,
            },
            {
              label: "asyncfn",
              kind: S.Snippet,
              insertTextRules: R,
              insertText:
                "async function ${1:name}(${2:args}): Promise<${3:void}> {\n    ${4}\n}",
              documentation: "async function",
              range,
            },
          ],
        };
      },
    });

    // C#
    monaco.languages.registerCompletionItemProvider("csharp", {
      provideCompletionItems(model: any, position: any) {
        const range = getRange(model, position);
        return {
          suggestions: [
            {
              label: "main",
              kind: S.Snippet,
              insertTextRules: R,
              insertText:
                "class Program\n{\n    static void Main()\n    {\n        ${1:// code}\n    }\n}",
              documentation: "main class",
              range,
            },
            {
              label: "cw",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: 'Console.WriteLine(${1:"Hello"});',
              documentation: "Console.WriteLine",
              range,
            },
            {
              label: "fori",
              kind: S.Snippet,
              insertTextRules: R,
              insertText:
                "for (int i = 0; i < ${1:n}; i++)\n{\n    ${2:// code}\n}",
              documentation: "for loop",
              range,
            },
          ],
        };
      },
    });

    // PHP
    monaco.languages.registerCompletionItemProvider("php", {
      provideCompletionItems(model: any, position: any) {
        const range = getRange(model, position);
        return {
          suggestions: [
            {
              label: "echo",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: 'echo ${1:"Hello World"};',
              documentation: "echo",
              range,
            },
            {
              label: "function",
              kind: S.Snippet,
              insertTextRules: R,
              insertText:
                "function ${1:name}(${2:args}) {\n    ${3:// code}\n}",
              documentation: "function",
              range,
            },
            {
              label: "foreach",
              kind: S.Snippet,
              insertTextRules: R,
              insertText:
                "foreach (${1:array} as ${2:item}) {\n    ${3:// code}\n}",
              documentation: "foreach loop",
              range,
            },
          ],
        };
      },
    });

    // Ruby
    monaco.languages.registerCompletionItemProvider("ruby", {
      provideCompletionItems(model: any, position: any) {
        const range = getRange(model, position);
        return {
          suggestions: [
            {
              label: "puts",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: 'puts ${1:"Hello World"}',
              documentation: "puts",
              range,
            },
            {
              label: "def",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: "def ${1:method_name}(${2:args})\n  ${3:# code}\nend",
              documentation: "method",
              range,
            },
            {
              label: "each",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: "${1:array}.each do |${2:item}|\n  ${3:# code}\nend",
              documentation: "each loop",
              range,
            },
          ],
        };
      },
    });

    // Go
    monaco.languages.registerCompletionItemProvider("go", {
      provideCompletionItems(model: any, position: any) {
        const range = getRange(model, position);
        return {
          suggestions: [
            {
              label: "main",
              kind: S.Snippet,
              insertTextRules: R,
              insertText:
                'package main\n\nimport "fmt"\n\nfunc main() {\n    ${1:// code}\n}',
              documentation: "main function",
              range,
            },
            {
              label: "fmt",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: 'fmt.Println(${1:"Hello World"})',
              documentation: "fmt.Println",
              range,
            },
            {
              label: "func",
              kind: S.Snippet,
              insertTextRules: R,
              insertText:
                "func ${1:name}(${2:args}) ${3:returnType} {\n    ${4:// code}\n}",
              documentation: "function",
              range,
            },
          ],
        };
      },
    });

    // Rust
    monaco.languages.registerCompletionItemProvider("rust", {
      provideCompletionItems(model: any, position: any) {
        const range = getRange(model, position);
        return {
          suggestions: [
            {
              label: "main",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: "fn main() {\n    ${1:// code}\n}",
              documentation: "main function",
              range,
            },
            {
              label: "println",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: 'println!("${1:Hello World}");',
              documentation: "println! macro",
              range,
            },
            {
              label: "fn",
              kind: S.Snippet,
              insertTextRules: R,
              insertText:
                "fn ${1:name}(${2:args}) -> ${3:ReturnType} {\n    ${4:// code}\n}",
              documentation: "function",
              range,
            },
          ],
        };
      },
    });

    // Kotlin
    monaco.languages.registerCompletionItemProvider("kotlin", {
      provideCompletionItems(model: any, position: any) {
        const range = getRange(model, position);
        return {
          suggestions: [
            {
              label: "main",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: "fun main() {\n    ${1:// code}\n}",
              documentation: "main function",
              range,
            },
            {
              label: "println",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: 'println(${1:"Hello World"})',
              documentation: "println",
              range,
            },
            {
              label: "fun",
              kind: S.Snippet,
              insertTextRules: R,
              insertText:
                "fun ${1:name}(${2:args}): ${3:ReturnType} {\n    ${4:// code}\n}",
              documentation: "function",
              range,
            },
          ],
        };
      },
    });

    // Swift
    monaco.languages.registerCompletionItemProvider("swift", {
      provideCompletionItems(model: any, position: any) {
        const range = getRange(model, position);
        return {
          suggestions: [
            {
              label: "print",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: 'print(${1:"Hello World"})',
              documentation: "print",
              range,
            },
            {
              label: "func",
              kind: S.Snippet,
              insertTextRules: R,
              insertText:
                "func ${1:name}(${2:args}) -> ${3:ReturnType} {\n    ${4:// code}\n}",
              documentation: "function",
              range,
            },
            {
              label: "fori",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: "for i in 0..<${1:n} {\n    ${2:// code}\n}",
              documentation: "for loop",
              range,
            },
          ],
        };
      },
    });

    // Dart
    monaco.languages.registerCompletionItemProvider("dart", {
      provideCompletionItems(model: any, position: any) {
        const range = getRange(model, position);
        return {
          suggestions: [
            {
              label: "main",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: "void main() {\n  ${1:// code}\n}",
              documentation: "main function",
              range,
            },
            {
              label: "print",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: "print('${1:Hello World}');",
              documentation: "print",
              range,
            },
            {
              label: "function",
              kind: S.Snippet,
              insertTextRules: R,
              insertText:
                "${1:ReturnType} ${2:name}(${3:args}) {\n  ${4:// code}\n}",
              documentation: "function",
              range,
            },
          ],
        };
      },
    });

    // Scala
    monaco.languages.registerCompletionItemProvider("scala", {
      provideCompletionItems(model: any, position: any) {
        const range = getRange(model, position);
        return {
          suggestions: [
            {
              label: "main",
              kind: S.Snippet,
              insertTextRules: R,
              insertText:
                "object Main {\n  def main(args: Array[String]): Unit = {\n    ${1:// code}\n  }\n}",
              documentation: "main object",
              range,
            },
            {
              label: "println",
              kind: S.Snippet,
              insertTextRules: R,
              insertText: 'println(${1:"Hello World"})',
              documentation: "println",
              range,
            },
            {
              label: "def",
              kind: S.Snippet,
              insertTextRules: R,
              insertText:
                "def ${1:name}(${2:args}): ${3:ReturnType} = {\n  ${4:// code}\n}",
              documentation: "function",
              range,
            },
          ],
        };
      },
    });
  }

  // Modal close on outside click
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showSettings) return;
    function handleClick(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSettings]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    setCode(codeTemplates[selectedLang]);
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running...");
    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          language_id: languageMap[language],
          source_code: code,
          stdin: input,
          encode: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setOutput(`Error: ${response.status} - ${errorData.error}`);
        setIsRunning(false);
        return;
      }

      const { token } = await response.json();

      const checkResult = async () => {
        const result = await fetch(`/api/execute/${token}`);

        if (!result.ok) {
          const errorData = await result.json();
          setOutput(`Error: ${result.status} - ${errorData.error}`);
          setIsRunning(false);
          return;
        }

        const data = await result.json();

        if (data.status?.id <= 2) {
          setTimeout(checkResult, 1500);
        } else {
          const decoded =
            (data.stdout && atob(data.stdout)) ||
            (data.compile_output && atob(data.compile_output)) ||
            (data.stderr && atob(data.stderr)) ||
            "No output";
          setOutput(decoded);
          setIsRunning(false);
        }
      };

      checkResult();
    } catch (err: any) {
      setOutput(`Error: ${err.message || err}`);
      setIsRunning(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Run code: Ctrl+'
      if (e.ctrlKey && (e.key === "'" || e.code === "Apostrophe")) {
        e.preventDefault();
        if (!isRunning) runCode();
      }
      // Save snippet: Ctrl+S
      if (e.ctrlKey && (e.key === "s" || e.code === "KeyS")) {
        e.preventDefault();
        if (showSaveModal) {
          // If modal is open, save directly
          if (!snippetTitle || snippetLoading) return;
          handleSaveSnippet();
        } else {
          if (!isLoggedIn) {
            showToast("Kindly log in first", "error");
            return;
          }
          setShowSaveModal(true);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isRunning,
    runCode,
    showSaveModal,
    snippetTitle,
    snippetLoading,
    isLoggedIn,
  ]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("kursor-editor-settings");
    if (saved) {
      const s = JSON.parse(saved);
      if (s.editorTheme) setEditorTheme(s.editorTheme);
      if (s.editorFont) setEditorFont(s.editorFont);
      if (s.fontSize) setFontSize(s.fontSize);
      if (s.tabWidth) setTabWidth(s.tabWidth);
      if (typeof s.useTabs === "boolean") setUseTabs(s.useTabs);
      if (typeof s.autoSave === "boolean") setAutoSave(s.autoSave);
      if (typeof s.lineWrapping === "boolean") setLineWrapping(s.lineWrapping);
      if (typeof s.autocomplete === "boolean") setAutocomplete(s.autocomplete);
      if (typeof s.linting === "boolean") setLinting(s.linting);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      "kursor-editor-settings",
      JSON.stringify({
        editorTheme,
        editorFont,
        fontSize,
        tabWidth,
        useTabs,
        autoSave,
        lineWrapping,
        autocomplete,
        linting,
      })
    );
  }, [
    editorTheme,
    editorFont,
    fontSize,
    tabWidth,
    useTabs,
    autoSave,
    lineWrapping,
    autocomplete,
    linting,
  ]);

  // Fetch all saved snippets on mount
  useEffect(() => {
    fetchSnippets();
  }, []);

  async function fetchSnippets() {
    setSnippetLoading(true);
    try {
      const res = await fetch("/api/saved-code");
      if (res.ok) {
        const data = await res.json();
        setSavedSnippets(data);
      }
    } finally {
      setSnippetLoading(false);
    }
  }

  async function handleSaveSnippet() {
    setSnippetLoading(true);
    try {
      const res = await fetch("/api/saved-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: snippetTitle, code, language }),
      });
      if (res.ok) {
        setShowSaveModal(false);
        setSnippetTitle("");
        fetchSnippets();
        showToast("Snippet saved", "success");
      } else {
        if (res.status === 401) {
          showToast("Kindly log in first", "error");
          return;
        }
        try {
          const data = await res.json();
          showToast(data?.error || "Failed to save snippet", "error");
        } catch {
          showToast("Failed to save snippet", "error");
        }
      }
    } finally {
      setSnippetLoading(false);
    }
  }

  async function handleUpdateSnippet() {
    if (!selectedSnippet) return;
    setSnippetLoading(true);
    try {
      const res = await fetch(`/api/saved-code/${selectedSnippet.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: renameTitle, code, language }),
      });
      if (res.ok) {
        setShowRenameModal(false);
        setRenameTitle("");
        fetchSnippets();
      }
    } finally {
      setSnippetLoading(false);
    }
  }

  async function handleDeleteSnippet(id: string) {
    setSnippetLoading(true);
    try {
      const res = await fetch(`/api/saved-code/${id}`, { method: "DELETE" });
      if (res.ok) {
        if (selectedSnippet && selectedSnippet.id === id)
          setSelectedSnippet(null);
        fetchSnippets();
      }
    } finally {
      setSnippetLoading(false);
    }
  }

  async function handleLoadSnippet(snippet: SavedCode) {
    setSelectedSnippet(snippet);
    setCode(snippet.code);
    setLanguage(snippet.language);
    setSnippetTitle(snippet.title);
  }

  // Lazy render editor only after first client paint (simple heuristic)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="scroll-locking mt-10 h-[calc(100vh-120px)] bg-gradient-to-br from-[#0f0f11] via-[#1c1c1e] to-[#0f0f11] text-white font-mono overflow-hidden">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 rounded-md px-4 py-2 shadow-lg border backdrop-blur-sm
            ${
              toast.type === "success"
                ? "bg-emerald-600/90 border-emerald-400/40"
                : toast.type === "error"
                ? "bg-red-600/90 border-red-400/40"
                : "bg-zinc-700/90 border-zinc-500/40"
            }`}
        >
          <span className="text-sm font-semibold text-white">{toast.msg}</span>
        </div>
      )}
      <header className="scroll-locking flex justify-between items-center px-6 py-4 shadow-lg backdrop-blur-sm bg-[#1a1a1acc] sticky top-0 z-20 border-b border-[#2c2c2e]">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent whitespace-nowrap pr-10">
          Kursor Editor
        </h1>
        <div className="flex items-center justify-between gap-4 w-full">
          <select
            style={{ cursor: "pointer" }}
            value={language}
            onChange={handleLanguageChange}
            className="bg-[#2c2c2e] border border-[#3c3c3e] px-3 py-1 rounded text-sm focus:outline-none focus:ring focus:ring-purple-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
            <option value="cpp">C++</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="php">PHP</option>
            <option value="ruby">Ruby</option>
            <option value="kotlin">Kotlin</option>
            <option value="swift">Swift</option>
            <option value="dart">Dart</option>
            <option value="scala">Scala</option>
          </select>
          <div className="flex-1 flex justify-center">
            <Tooltip title={"Shortcut: Ctrl + '"} arrow placement="bottom">
              <span>
                <button
                  style={{ cursor: "pointer" }}
                  onClick={runCode}
                  disabled={isRunning}
                  className={`relative px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out
                    ${
                      isRunning
                        ? "cursor-not-allowed bg-gray-600"
                        : "bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-400 hover:to-fuchsia-500 active:scale-95"
                    }
                    text-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-400`}
                >
                  <span className="relative z-10 flex items-center gap-1">
                    {isRunning ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                        Running...
                      </>
                    ) : (
                      <>Run ▶</>
                    )}
                  </span>
                </button>
              </span>
            </Tooltip>
          </div>
          <div className="flex items-center gap-4">
            <button
              style={{ cursor: "pointer" }}
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-violet-400 flex items-center justify-center"
              title="Editor Settings"
            >
              <Settings size={20} />
            </button>
            <button
              style={{ cursor: "pointer" }}
              onClick={() => setShowSnippets(true)}
              className="px-4 py-2 rounded bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold shadow-md"
            >
              My Snippets
            </button>
            <Tooltip title={"Shortcut: Ctrl + '"} arrow placement="bottom">
              <span>
                <button
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (!isLoggedIn) {
                      showToast("Kindly log in first", "error");
                      return;
                    }
                    setShowSaveModal(true);
                  }}
                  className="px-4 py-2 rounded bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold shadow-md"
                >
                  Save
                </button>
              </span>
            </Tooltip>{" "}
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div
            ref={modalRef}
            className="bg-[#18181b] rounded-2xl shadow-2xl p-8 w-full max-w-lg relative"
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold"
              onClick={() => setShowSettings(false)}
              aria-label="Close settings"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Editor Settings
            </h2>
            <div className="space-y-5">
              {/* Theme Selection */}
              <div>
                <label className="block mb-2 font-semibold">Theme</label>
                <select
                  value={editorTheme}
                  onChange={(e) => setEditorTheme(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-[#23232b] border border-[#333] text-white"
                >
                  {themes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Font & Size */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block mb-2 font-semibold">Font</label>
                  <select
                    value={editorFont}
                    onChange={(e) => setEditorFont(e.target.value)}
                    className="w-full px-4 py-2 rounded bg-[#23232b] border border-[#333] text-white"
                  >
                    {fonts.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    Make sure the font is loaded in your system or via CSS for
                    best results.
                  </p>
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Font Size</label>
                  <input
                    type="number"
                    min={10}
                    max={32}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-20 px-2 py-2 rounded bg-[#23232b] border border-[#333] text-white"
                  />
                </div>
              </div>
              {/* Tab Width / Indentation */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block mb-2 font-semibold">Tab Width</label>
                  <input
                    type="number"
                    min={2}
                    max={8}
                    value={tabWidth}
                    onChange={(e) => setTabWidth(Number(e.target.value))}
                    className="w-20 px-2 py-2 rounded bg-[#23232b] border border-[#333] text-white"
                  />
                </div>
                <div className="flex-1 flex items-end gap-2">
                  <label className="font-semibold mb-2">Use Tabs</label>
                  <input
                    type="checkbox"
                    checked={useTabs}
                    onChange={(e) => setUseTabs(e.target.checked)}
                    className="ml-2"
                  />
                  <span className="text-xs text-gray-400">(vs spaces)</span>
                </div>
              </div>
              {/* Auto Save Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className=""
                  id="autoSave"
                />
                <label htmlFor="autoSave" className="font-semibold">
                  Auto Save
                </label>
              </div>
              {/* Line Wrapping */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={lineWrapping}
                  onChange={(e) => setLineWrapping(e.target.checked)}
                  className=""
                  id="lineWrapping"
                />
                <label htmlFor="lineWrapping" className="font-semibold">
                  Line Wrapping
                </label>
              </div>
              {/* Autocomplete & IntelliSense Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={autocomplete}
                  onChange={(e) => setAutocomplete(e.target.checked)}
                  className=""
                  id="autocomplete"
                />
                <label htmlFor="autocomplete" className="font-semibold">
                  Autocomplete & IntelliSense
                </label>
              </div>
              {/* Enable/Disable Linting */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={linting}
                  onChange={(e) => setLinting(e.target.checked)}
                  className=""
                  id="linting"
                />
                <label htmlFor="linting" className="font-semibold">
                  Enable Linting
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Snippet List Modal */}
      {showSnippets && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#18181b] rounded-2xl shadow-2xl p-8 w-full max-w-xl relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold"
              onClick={() => setShowSnippets(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">My Snippets</h2>
            {snippetLoading ? (
              <div>Loading...</div>
            ) : (
              <ul className="space-y-2 max-h-80 overflow-y-auto">
                {savedSnippets.map((snippet) => (
                  <li
                    key={snippet.id}
                    className="flex items-center justify-between bg-[#23232b] rounded p-3"
                  >
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => handleLoadSnippet(snippet)}
                    >
                      <div className="font-semibold text-lg">
                        {snippet.title}
                      </div>
                      <div className="text-xs text-gray-400">
                        {snippet.language}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        className="px-2 py-1 rounded bg-violet-600 hover:bg-violet-700 text-xs text-white"
                        onClick={() => {
                          setSelectedSnippet(snippet);
                          setRenameTitle(snippet.title);
                          setShowRenameModal(true);
                        }}
                      >
                        Rename
                      </button>
                      <button
                        className="px-2 py-1 rounded border border-violet-500/50 text-violet-300 hover:bg-violet-500/10 text-xs"
                        onClick={() => handleDeleteSnippet(snippet.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#18181b] rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold"
              onClick={() => setShowSaveModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Save Snippet</h2>
            <input
              className="w-full px-4 py-2 rounded bg-[#23232b] border border-[#333] text-white mb-4"
              placeholder="Snippet Title"
              value={snippetTitle}
              onChange={(e) => setSnippetTitle(e.target.value)}
            />
            <button
              className="w-full py-2 rounded bg-violet-600 hover:bg-violet-700 text-white font-semibold"
              onClick={handleSaveSnippet}
              disabled={!snippetTitle || snippetLoading}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#18181b] rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold"
              onClick={() => setShowRenameModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Rename Snippet</h2>
            <input
              className="w-full px-4 py-2 rounded bg-[#23232b] border border-[#333] text-white mb-4"
              placeholder="New Title"
              value={renameTitle}
              onChange={(e) => setRenameTitle(e.target.value)}
            />
            <button
              className="w-full py-2 rounded bg-violet-600 hover:bg-violet-700 text-white font-semibold"
              onClick={handleUpdateSnippet}
              disabled={!renameTitle || snippetLoading}
            >
              Rename
            </button>
          </div>
        </div>
      )}

      <main className="flex flex-1 min-h-0 h-[calc(100vh-200px)] gap-6 px-6 py-8 overflow-hidden">
        <div className="flex-1 h-full w-full overflow-hidden">
          <Split
            sizes={[50, 50]}
            minSize={[300, 300]}
            expandToMin={true}
            gutterSize={10}
            direction="horizontal"
            className="flex h-full w-full"
            style={{ height: "100%", width: "100%" }}
          >
            <section className="flex flex-col h-full w-full min-h-0 overflow-hidden">
              <h2 className="mb-2 text-lg text-gray-400">Code</h2>
              <div className="pt-5 flex-1 min-h-0 overflow-hidden rounded-xl shadow-md border border-[#3c3c3e] bg-[#1c1c1e]">
                {mounted && (
                  <Editor
                    height="100%"
                    theme={editorTheme}
                    language={language}
                    value={code}
                    onChange={(v) => setCode(v || "")}
                    options={{
                      fontSize,
                      minimap: { enabled: true },
                      fontFamily: editorFont,
                      smoothScrolling: true,
                      wordWrap: lineWrapping ? "on" : "off",
                      tabSize: tabWidth,
                      insertSpaces: !useTabs,
                      autoClosingBrackets: autocomplete ? "always" : "never",
                      quickSuggestions: autocomplete,
                      suggestOnTriggerCharacters: autocomplete,
                      inlineSuggest: { enabled: true },
                      formatOnType: linting,
                      formatOnPaste: linting,
                    }}
                    beforeMount={handleEditorWillMount}
                  />
                )}
              </div>
            </section>

            <section className="flex flex-col h-full w-full overflow-hidden">
              <Split
                direction="vertical"
                sizes={[40, 60]}
                minSize={[80, 80]}
                expandToMin
                gutterSize={10}
                className="flex flex-col h-full w-full"
              >
                <div className="flex flex-col h-full w-full overflow-hidden">
                  <h3 className="mb-2 text-lg text-gray-400">Standard Input</h3>
                  <textarea
                    className="h-full w-full p-3 rounded-xl bg-[#1c1c1e] border-none resize-none"
                    rows={5}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter input..."
                    style={{ minHeight: "40px", maxHeight: "900px" }}
                  />
                </div>
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  <h3 className="mb-2 text-lg text-gray-400">Output</h3>
                  <pre className="w-full flex-1 min-h-0 p-4 rounded-xl bg-[#1c1c1e] border border-[#3c3c3e] text-green-400 whitespace-pre-wrap overflow-auto">
                    {output}
                  </pre>
                </div>
              </Split>
            </section>
          </Split>
        </div>
      </main>

      <style jsx global>{`
        .gutter {
          background: #232326;
          opacity: 1;
          border-radius: 6px;
          transition: background 0.18s;
          z-index: 0; /* prevents overlapping */
        }
        .gutter.gutter-horizontal {
          cursor: col-resize;
          width: 8px;
          min-width: 6px;
          margin-left: 20px;
          margin-right: 20px;
          // margin-bottom: 0px;
          margin-top: 35px;
        }
        .gutter.gutter-vertical {
          cursor: row-resize;
          height: 8px;
          min-height: 6px;
          margin: 20px 0;
        }
        .gutter:hover {
          background: #44444a;
        }
      `}</style>
    </div>
  );
}
