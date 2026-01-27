import React, { useRef } from "react";
import ParamEditor from "./ParamEditor";

const App: React.FC = () => {
  const editorRef = useRef<ParamEditor>(null);

  const params = [
    { id: 1, name: "Назначение", type: "string" as const },
    { id: 2, name: "Длина", type: "string" as const },
  ];

  const model = {
    paramValues: [
      { paramId: 1, value: "повседневное" },
      { paramId: 2, value: "макси" },
    ],
    colors: [],
  };

  const handleGetModel = () => {
    const result = editorRef.current?.getModel();
    console.log("MODEL:", result);
    alert(JSON.stringify(result, null, 2));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1
        style={{
          fontSize: 48,
          fontWeight: 600,
          marginBottom: 20,
          margin: "40px auto",
          textAlign: "center",
        }}
      >
        ParamEditor demo
      </h1>

      <ParamEditor ref={editorRef} params={params} model={model} />

      <button
        onClick={handleGetModel}
        style={{
          fontSize: 32,
          fontWeight: 400,
          marginBottom: 25,
          margin: "40px auto",
          display: "flex",
          justifyContent: "center",
          borderRadius: 8,
          padding: "12px 24px",
          cursor: "pointer",
        }}
      >
        Получить модель
      </button>
    </div>
  );
};

export default App;
