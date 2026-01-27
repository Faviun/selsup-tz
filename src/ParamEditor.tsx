import React, { Component, ChangeEvent, JSX } from "react";

// =============== TYPES ===============
interface Color {
  id: number;
  name: string;
}

interface Param {
  id: number;
  name: string;
  type: "string";
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
  colors: Color[];
}

interface Props {
  params: Param[];
  model: Model;
}

interface State {
  paramValues: Map<number, string>;
}

class ParamEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const paramValuesMap = new Map<number, string>();

    props.model.paramValues.forEach((pv) => {
      paramValuesMap.set(pv.paramId, pv.value);
    });

    props.params.forEach((param) => {
      if (!paramValuesMap.has(param.id)) {
        paramValuesMap.set(param.id, "");
      }
    });

    this.state = {
      paramValues: paramValuesMap,
    };
  }

  private handleParamChange = (paramId: number, value: string): void => {
    this.setState((prevState) => {
      const newParamValues = new Map(prevState.paramValues);
      newParamValues.set(paramId, value);
      return { paramValues: newParamValues };
    });
  };

  public getModel(): Model {
    const paramValues: ParamValue[] = [];

    this.state.paramValues.forEach((value, paramId) => {
      paramValues.push({
        paramId,
        value,
      });
    });

    return {
      paramValues,
      colors: this.props.model.colors || [],
    };
  }

  render() {
    const { params } = this.props;
    const { paramValues } = this.state;

    return (
      <div
        style={{
          maxWidth: "500px",
          margin: "20px auto",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2 style={{ marginTop: 0, color: "#333" }}>Редактор параметров</h2>

        {params.map((param) => (
          <div key={param.id} style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
                color: "#555",
              }}
            >
              {param.name}:
            </label>
            <input
              type="text"
              value={paramValues.get(param.id) || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                this.handleParamChange(param.id, e.target.value)
              }
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
              placeholder={`Введите значение для ${param.name}`}
            />
          </div>
        ))}

        <div
          style={{
            marginTop: "30px",
            padding: "15px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Текущая модель:</h3>
          <pre
            style={{
              backgroundColor: "#fff",
              padding: "10px",
              borderRadius: "4px",
              overflow: "auto",
              fontSize: "12px",
            }}
          >
            {JSON.stringify(this.getModel(), null, 2)}
          </pre>
        </div>
      </div>
    );
  }
}

export class ExampleUsage extends Component {
  private editorRef = React.createRef<ParamEditor>();

  private params: Param[] = [
    {
      id: 1,
      name: "Назначение",
      type: "string",
    },
    {
      id: 2,
      name: "Длина",
      type: "string",
    },
  ];

  private model: Model = {
    paramValues: [
      {
        paramId: 1,
        value: "повседневное",
      },
      {
        paramId: 2,
        value: "макси",
      },
    ],
    colors: [],
  };

  private handleGetModel = (): void => {
    if (this.editorRef.current) {
      const model = this.editorRef.current.getModel();
      console.log("Полученная модель:", model);
      alert(JSON.stringify(model, null, 2));
    }
  };

  render() {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Пример использования редактора параметров</h1>

        <ParamEditor
          ref={this.editorRef}
          params={this.params}
          model={this.model}
        />

        <button
          onClick={this.handleGetModel}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Получить модель
        </button>
      </div>
    );
  }
}

export default ParamEditor;

type ParamType = "string" | "number" | "select";

interface ExtendedParam {
  id: number;
  name: string;
  type: ParamType;
  options?: string[];
}

abstract class ParamInputFactory {
  static createInput(
    param: ExtendedParam,
    value: string,
    onChange: (value: string) => void,
  ): JSX.Element {
    switch (param.type) {
      case "string":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case "select":
        return (
          <select value={value} onChange={(e) => onChange(e.target.value)}>
            {param.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  }
}

export class ExtendedParamEditor extends Component<
  {
    params: ExtendedParam[];
    model: Model;
  },
  State
> {}

// =============== TESTS ===============
// Простые тесты для проверки функциональности
export const runTests = (): void => {
  console.log("=== Тестирование ParamEditor ===");

  // Тест 1: Проверка типов
  console.assert(
    typeof ParamEditor === "function",
    "ParamEditor должен быть функцией",
  );

  // Тест 2: Проверка метода getModel
  const testComponent = new ParamEditor({
    params: [{ id: 1, name: "Тест", type: "string" }],
    model: { paramValues: [], colors: [] },
  });

  console.assert(
    typeof testComponent.getModel === "function",
    "getModel должен быть функцией",
  );

  // Тест 3: Проверка структуры возвращаемой модели
  const model = testComponent.getModel();
  console.assert("paramValues" in model, "Модель должна содержать paramValues");
  console.assert("colors" in model, "Модель должна содержать colors");

  console.log("Все тесты пройдены успешно");
};

if (process.env.NODE_ENV === "development") {
  runTests();
}
