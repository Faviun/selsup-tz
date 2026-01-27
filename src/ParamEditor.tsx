import React, { Component, ChangeEvent } from "react";

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
          maxWidth: 480,
          margin: "40px auto",
          padding: 24,
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          backgroundColor: "#ffffff",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
        }}
      >
        <h2
          style={{
            marginBottom: 24,
            fontSize: 20,
            fontWeight: 600,
            color: "#111827",
          }}
        >
          Редактор параметров
        </h2>

        {params.map((param) => {
          const inputId = `param-${param.id}`;

          return (
            <div key={param.id} style={{ marginBottom: 20 }}>
              <label
                htmlFor={inputId}
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                {param.name}
              </label>

              <input
                id={inputId}
                type="text"
                value={paramValues.get(param.id) || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  this.handleParamChange(param.id, e.target.value)
                }
                placeholder={`Введите значение для ${param.name}`}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: 14,
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  outline: "none",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
              />
            </div>
          );
        })}

        <div
          style={{
            marginTop: 32,
            padding: 16,
            borderRadius: 8,
            backgroundColor: "#f9fafb",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              marginBottom: 8,
              fontSize: 14,
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Текущая модель
          </div>

          <pre
            style={{
              margin: 0,
              fontSize: 12,
              lineHeight: 1.5,
              color: "#1f2937",
              overflowX: "auto",
            }}
          >
            {JSON.stringify(this.getModel(), null, 2)}
          </pre>
        </div>
      </div>
    );
  }
}

export default ParamEditor;
