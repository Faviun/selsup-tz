import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ParamEditor from "./ParamEditor";

describe("ParamEditor", () => {
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

  test("рендерит инпуты для всех параметров", () => {
    render(<ParamEditor params={params} model={model} />);

    expect(screen.getByLabelText("Назначение")).toBeInTheDocument();
    expect(screen.getByLabelText("Длина")).toBeInTheDocument();
  });

  test("инициализирует значения из model", () => {
    render(<ParamEditor params={params} model={model} />);

    const purposeInput = screen.getByLabelText(
      "Назначение",
    ) as HTMLInputElement;

    const lengthInput = screen.getByLabelText("Длина") as HTMLInputElement;

    expect(purposeInput.value).toBe("повседневное");
    expect(lengthInput.value).toBe("макси");
  });

  test("обновляет значение при вводе", () => {
    render(<ParamEditor params={params} model={model} />);

    const purposeInput = screen.getByLabelText(
      "Назначение",
    ) as HTMLInputElement;

    fireEvent.change(purposeInput, {
      target: { value: "спортивное" },
    });

    expect(purposeInput.value).toBe("спортивное");
  });

  test("getModel возвращает актуальную модель", () => {
    const ref = React.createRef<ParamEditor>();

    render(<ParamEditor ref={ref} params={params} model={model} />);

    const purposeInput = screen.getByLabelText(
      "Назначение",
    ) as HTMLInputElement;

    fireEvent.change(purposeInput, {
      target: { value: "вечернее" },
    });

    const result = ref.current!.getModel();

    expect(result).toEqual({
      paramValues: [
        { paramId: 1, value: "вечернее" },
        { paramId: 2, value: "макси" },
      ],
      colors: [],
    });
  });
});
